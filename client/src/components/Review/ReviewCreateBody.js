import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import "../../App.css"
import {Button, Col, Form, Image, Row} from "react-bootstrap";
import {Multiselect} from "multiselect-react-dropdown";
import {UploadImage} from "../../components/index.components";
import {useDispatch, useSelector} from "react-redux";
import {setEditedReview} from "../../store/reducers/ReviewSlice";

export const ReviewCreateBody = forwardRef((props, ref) => {

    const [selectedTags, setSelectedTags] = useState([])
    const dispatch = useDispatch()

    let currentReview = Object.assign({}, props.review)

    useEffect(async () => {

        if (currentReview && currentReview.tags !== "") {
            setSelectedTags((currentReview.tags).split(","))
        }
        console.log(currentReview)
    }, []);


    useImperativeHandle(ref, () => ({
         save() {
             dispatch(setEditedReview(currentReview))
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
                                      onKeyDown={(evt) => evt.preventDefault()}
                                      onChange={e => {
                                          currentReview.authorScore = e.target.value
                                      }
                                      }
                        />
                    </Col>
                </Row>

                <Form.Group className="mb-3 mt-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Text</Form.Label>
                    <Form.Control as="textarea"
                                  rows={7}
                                  type="text"
                                  defaultValue={props.review?.text}
                                  placeholder="Enter review text"
                                  onChange={e => {
                                      currentReview.text = e.target.value
                                  }
                                  }
                    />
                </Form.Group>


                <UploadImage
                    updateImages={updateImages}
                    filesUrl={currentReview?.images}
                />

            </Form>
        </div>
    )
}
)