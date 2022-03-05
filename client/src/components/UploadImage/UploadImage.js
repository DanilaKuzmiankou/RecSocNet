import React, {useEffect, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {Image, OverlayTrigger, Tooltip} from "react-bootstrap";

export const UploadImage = ({updateImages, filesUrl}) => {

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
    };

    const focusedStyle = {
        borderColor: '#2196f3'
    };

    const acceptStyle = {
        borderColor: '#00e676'
    };

    const rejectStyle = {
        borderColor: '#ff1744'
    };


    const [files, setFiles] = useState([]);
    const dropzone = useDropzone({
        accept: 'image/*',

        onDrop: async acceptedFiles => {
            console.log('accept', acceptedFiles)
            let newFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))
            let prev = [...files]
            prev = prev.concat(newFiles)
            updateImages(prev)
            setFiles(prev);
        }
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(dropzone.isFocused ? focusedStyle : {}),
        ...(dropzone.isDragAccept ? acceptStyle : {}),
        ...(dropzone.isDragReject ? rejectStyle : {})
    }), []);


    const thumbs = files.map(function (file, index) {
        return (
            <div className="thumb" key={index}>
                <div className="thumbInner">
                    <OverlayTrigger delay={{show: 150, hide: 300}}
                                    overlay={<Tooltip id="tooltip-disabled">Click to remove picture</Tooltip>}>
                        <Image
                            onClick={() => removePicture(file)}
                            src={file.preview}
                            className="review_img"
                        />
                    </OverlayTrigger>

                </div>
            </div>
        )
    });

    useEffect(async () => {
        // Make sure to revoke the data uris to avoid memory leaks

        if (filesUrl && filesUrl.length) {
            let newFiles = [...files]
            for(let i=0; i<filesUrl.length; i++) {
                let obj = {
                    preview: filesUrl[i].imageLink
                }
                newFiles.push(obj)
            }
            setFiles(newFiles)
        }

        //files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [filesUrl]);


    const removePicture = async (file) => {
        let newFiles = [...files]
        newFiles = newFiles.filter(iteratedFile => iteratedFile.preview !== file.preview)
        setFiles(newFiles)
        updateImages(newFiles)
    };

    return (
        <section className="container">
            <div {...dropzone.getRootProps({style})}>
                <input {...dropzone.getInputProps()} />
                <p>Drag 'n' drop pictures here, or click to select</p>
            </div>
            {files && files.length > 0 && <h6 className="small_margin_top">Pictures to upload</h6>}
            <aside className="thumbsContainer">
                {thumbs}
            </aside>
        </section>
    );
}

