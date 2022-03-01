import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import {useState} from "react";

export const UploadImage = ({updateImages}) => {

    const [images, setImages] = useState([])

    const getUploadParams = ({ file, meta }) => {
        let imagesCopied = [...images]
        imagesCopied.push(file)
        setImages(imagesCopied)
        updateImages(imagesCopied)
        return {url: process.env.REACT_APP_SERVER_URL + "/api/user/dropzone"}
    }


    const handleChangeStatus = async ({meta, file}, status) => {
        if (status === "removed") {
            let imagesCopied = [...images]
            imagesCopied = imagesCopied.filter(function(item) {
                return item !== file
            })
            setImages(imagesCopied)
            updateImages(imagesCopied)
        }
    }

    const handleSubmit = (files) => {}

    return (

         <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept="image/*"
        />

    )
}