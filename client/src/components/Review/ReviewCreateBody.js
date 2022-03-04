import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import "../../App.css"
import {Button, Col, Form, Image, Row} from "react-bootstrap";
import {Multiselect} from "multiselect-react-dropdown";
import {UploadImage} from "../../components/index.components";

export const ReviewCreateBody = (props) => {

   const [selectedTags, setSelectedTags] = useState([])

    let newReview = props.review
    let oldRevIm = props.review.images

    useEffect(async () => {
            if(newReview && newReview.tags !== ""){
                setSelectedTags((newReview.tags).split(","))
            }
            updateReview()
        oldRevIm = props.review.images
    }, []);



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
        newReview.tags = selectedList.join(',')
        updateReview()
    }

    function onRemove(selectedList, removedItem) {
        newReview.tags = selectedList.join(',')
        updateReview()
    }

    function updateReview() {
        props.updateRedactedReview(newReview);
    }

    function updateImages(images) {
        newReview.images = images
        updateReview();
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
            <Form onSubmit={(e) => updateReview()}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter review title"
                        defaultValue={props.review?.title}
                        onChange={e => {
                            newReview.title = e.target.value
                            updateReview()
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
                                    newReview.category = e.target.value
                                    updateReview()
                                } else {
                                    newReview.category = ""
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
                                          newReview.authorScore = e.target.value
                                          updateReview()
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
                                      newReview.text = e.target.value
                                      updateReview()
                                  }
                                  }
                    />
                </Form.Group>



                {/** <UploadImage updateImages={updateImages} /> */}

                <UploadImage
                    updateImages={updateImages}
                    filesUrl={newReview?.images}
                />

            </Form>
        </div>
    )
}