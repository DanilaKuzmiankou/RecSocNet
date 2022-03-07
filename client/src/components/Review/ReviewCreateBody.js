import React, {forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState} from "react";
import "../../App.css"
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {Multiselect} from "multiselect-react-dropdown";
import {UploadImage} from "../../components/index.components";
import {useDispatch, useSelector} from "react-redux";
import {setEditedReview} from "../../store/reducers/ReviewSlice";
import { Editor } from 'react-draft-wysiwyg';
import draftToMarkdown from 'draftjs-to-markdown';
import { convertToRaw } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import EditorState from "draft-js/lib/EditorState";
import { markdownToDraft } from 'markdown-draft-js';

export const ReviewCreateBody = forwardRef((props, ref) => {

        const [selectedTags, setSelectedTags] = useState([])
        const [editorState, setEditorState] = useState(undefined)


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
            setEditorState(EditorState.createWithContent(convertFromRaw(markdownToDraft(props.review?.text))))
        }

        return () => { isMounted = false };
    }, []);

        const getNodesToRemoveFromElement = (stringContent) => {
            const el = document.createElement('div');
            el.innerHTML = stringContent;
            return el.getElementsByClassName('remove-me');
        };

        function removeHTML(stringWithHTML){
            return stringWithHTML.replace(/<\/?[^>]+(>|$)/g, "");
        }


    useImperativeHandle(ref, () => ({
         save() {
             let rawString = draftToMarkdown(convertToRaw(editorState.getCurrentContent()))
             currentReview.text = removeHTML(rawString)
             dispatch(setEditedReview(currentReview))
             console.log('sending..', currentReview)
             return currentReview
        }
    }));


    let tags =
        [
            "world war",
            "fantasy",
            "scam",
            "politics"
        ]

    let category =
        [
            "books",
            "games",
            "music",
            "lifestyle"
        ]

    function onSelect(selectedList, selectedItem) {
        currentReview.tags = selectedList.join(',')
    }

    function onRemove(selectedList, removedItem) {
        currentReview.tags = selectedList.join(',')
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

    const validateNumberInput = (key) =>{
        if((!isNaN(key) && key >= 1 && key <= 5 && currentReview.authorScore.length<1))
        {
            return true
        }
    }
    const onKeyDown = (event) => {
        const permittedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"]
        if(validateNumberInput(event.key) || permittedKeys.indexOf(event.key) >= 0){
            return
        }
        event.preventDefault()
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
                            onKeyPressFn={function noRefCheck() {
                            }}
                            onRemove={onRemove}
                            onSearch={function noRefCheck() {
                            }}
                            onSelect={onSelect}
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


                <Form.Label>Text</Form.Label>
                <div className='editor'>
                        <Editor
                            wrapperClassName="no_text_decorations"
                            editorClassName="demo-editor"
                            editorState={editorState}
                            onEditorStateChange={function (editorState) {
                                setEditorState(editorState)
                            }}
                            toolbar={{
                                options: ['inline',  'remove', 'history'],
                                inline: {
                                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                                }
                            }}
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