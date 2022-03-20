import React, {forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState} from "react";
import "../../App.css"
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {Multiselect} from "multiselect-react-dropdown";
import {UploadImage} from "../../components/index.components";
import {useDispatch, useSelector} from "react-redux";
import {setEditedReview} from "../../store/reducers/ReviewSlice";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export const ReviewCreateBody = forwardRef((props, ref) => {


        let tagsArray =
            [
                "world war",
                "fantasy",
                "scam",
                "politics",
            ]


        const [selectedTags, setSelectedTags] = useState([])
        const [tags, setTags] = useState(tagsArray)
        const [isEmptyTagExist, setIsEmptyTagExist] = useState(false)

        const [editorText, setEditorText] = useState('');
        const [currentTag, setCurrentTag] = useState('');
        const dispatch = useDispatch()

        let currentReview = Object.assign({}, props.review)

        useEffect(async () => {
            let isMounted = true;

            if (currentReview && currentReview.tags !== "") {
                if (isMounted) {
                    setSelectedTags((currentReview.tags).split(","))
                }
            }
            console.log('new cur rev: ', currentReview)
            if (isMounted) {
                //console.log('text: ', props.review?.text)
                setEditorText(currentReview.text)
            }

            return () => {
                isMounted = false
            };
        }, []);


        useImperativeHandle(ref, () => ({
            save() {
                currentReview.tags = selectedTags.join(',')
                console.log('cur before ', currentReview)
                console.log('sel before ', selectedTags)
                dispatch(setEditedReview(currentReview))
                console.log('sending..', currentReview)
                return currentReview
            }
        }));


        let category =
            [
                "books",
                "games",
                "music",
                "lifestyle"
            ]

        function onMultiselectSelect(selectedList, selectedItem) {
            if (selectedItem && selectedTags.indexOf(selectedItem) === -1 && selectedItem.trim()) {
                let newTagsList = [...selectedTags, selectedItem]
                setSelectedTags(newTagsList)
            }
        }

        function onMultiselectRemove(selectedList, removedItem) {
            let newTagsList = selectedTags
            if(typeof removedItem === "number"){
                newTagsList.splice(removedItem, 1)
            }
            else {
                newTagsList = selectedTags.filter(tag => tag !== removedItem)
            }
            setSelectedTags(newTagsList)
        }

        function onMultiselectSearch(searchedTag) {
            setCurrentTag(searchedTag)
            if (isEmptyTagExist) {
                deleteLastTag()
            }
            if (tags.find(tag => tag === searchedTag) === undefined) {
                setTags(tags => [...tags, searchedTag])
                setIsEmptyTagExist(true)
            } else {
                deleteLastTag()
            }
        }

        function deleteLastTag() {
            let newTags = [...tags]
            newTags.pop()
            setTags(newTags)
        }

        function onMultiselectKeyPress(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                onMultiselectSelect([], currentTag)
                setCurrentTag()
            }
        }

        function updateImages(images) {
            currentReview.images = images
        }

        const options = category.map((item) => {
            return (
                <option key={item} value={item}>
                    {item}
                </option>
            )
        })

        const validateNumberInput = (key) => {
            if ((!isNaN(key) && key >= 1 && key <= 5 && currentReview.authorScore.length < 1)) {
                return true
            }
        }
        const onKeyDown = (event) => {
            const permittedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"]
            if (validateNumberInput(event.key) || permittedKeys.indexOf(event.key) >= 0) {
                return
            }
            event.preventDefault()
        }


        const modules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],
                [{'direction': 'rtl'}],                         // text direction

                [{'size': ['small', 'large']}],  // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6]}],

                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'font': []}],
                [{'align': []}],

                ['clean']                                         // remove formatting button
            ]
        }

        return (
            <div>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter review title"
                            defaultValue={props.review?.title}
                            onChange={e => {
                                currentReview.title = e.target.value
                            }
                            }
                        />
                    </Form.Group>


                    <Row>
                        <Col xs={3}>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                aria-label="Category"
                                defaultValue={props.review?.category}
                                onChange={e => {
                                    if (e.target.value !== "Select category") {
                                        currentReview.category = e.target.value
                                    } else {
                                        currentReview.category = ""
                                    }
                                }
                                }
                            >
                                <option>Select category</option>
                                {options}
                            </Form.Control>
                        </Col>


                        <Col xs={8}>
                            <Form.Label>Tags</Form.Label>
                            <Multiselect
                                isObject={false}
                                selectedValues={selectedTags}
                                avoidHighlightFirstOption={true}
                                onKeyPressFn={onMultiselectKeyPress}
                                onRemove={onMultiselectRemove}
                                onSearch={onMultiselectSearch}
                                onSelect={onMultiselectSelect}
                                options={tags}
                                placeholder="Enter tags"
                            />
                        </Col>

                        <Col>
                            <Form.Label>Score</Form.Label>
                            <Form.Control type="number"
                                          defaultValue={props.review?.authorScore}
                                          max="5"
                                          min="1"
                                          onKeyDown={onKeyDown}
                                          onChange={e => {
                                              currentReview.authorScore = e.target.value
                                          }
                                          }
                            />
                        </Col>
                    </Row>


                    <div className='editor'>
                        <Form.Label>Text</Form.Label>
                        <ReactQuill
                            className="ql-editor"
                            theme="snow"
                            value={editorText}
                            onChange={value => {
                                currentReview.text = value
                            }
                            }
                            modules={modules}
                        />
                    </div>

                    <UploadImage
                        updateImages={updateImages}
                        filesUrl={currentReview?.images}
                    />

                </Form>
            </div>
        )
    }
)