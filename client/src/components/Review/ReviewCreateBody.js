/* eslint-disable */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import '../../App.css';
// import { Col, Form, Row } from 'react-bootstrap';
import { Multiselect } from 'multiselect-react-dropdown';
import { UploadImage } from '../UploadImage/UploadImage';
import { useDispatch, useSelector } from 'react-redux';
import { setEditedReview, setReviews, setSelectedReview } from '../../store/reducers/ReviewSlice';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Col, Row } from 'react-bootstrap';
import { CustomMultiselect } from '../CustomMultiselect/CustomMultiselect';
import {
  addImagesToDatabase,
  deleteImagesFromFirebaseCloud,
  saveEditedReview,
  saveNewReview,
  uploadImagesToFirebaseCloud,
} from '../../api/store/ReviewStore';
import { setIsLoading } from '../../store/reducers/LoadingSlice';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

// eslint-disable-next-line react/display-name
export const ReviewCreateBody = (props) => {
  const tagsArray = ['world war', 'fantasy', 'scam', 'politics'];

  const isLoading = useSelector((state) => state.loading.isLoading);

  const dispatch = useDispatch();
  const { browsedUser } = useSelector((state) => state.user);
  const { reviews, editedReview } = useSelector((state) => state.review);

  const category = ['books', 'games', 'music', 'lifestyle'];

  const options = category.map((item) => {
    return (
      <option key={item} value={item}>
        {item}
      </option>
    );
  });

  useEffect(() => {}, [dispatch]);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', 'large'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button
    ],
  };

  const handleToUpdate = async (newReview) => {
    await uploadOrDeletePictures(newReview);
    Object.assign(newReview, {
      id: props.review.id,
    });
    const reviewFromApi = await saveEditedReview(newReview);
    const newArr = reviews.map((item) => (item.id === reviewFromApi.id ? reviewFromApi : item));
    dispatch(setReviews(newArr));
    dispatch(setSelectedReview(reviewFromApi));
  };

  const handleToCreate = async (newReview) => {
    newReview.images = await uploadImagesToFirebase(newReview.images);
    const createdReview = await saveNewReview(browsedUser.authId, newReview);
    dispatch(setReviews([...reviews, createdReview[0]]));
  };

  const uploadImagesToFirebase = async (pictures) => {
    if (pictures && pictures.length > 0) {
      const urls = await uploadImagesToFirebaseCloud(pictures);
      return urls;
    }
  };

  const uploadOrDeletePictures = async (newReview) => {
    const picturesToUpload = [];
    const redactedPictures = [];
    const allPictures = newReview.images;
    allPictures.forEach(function (picture) {
      if (picture.constructor === File) {
        picturesToUpload.push(picture);
      } else {
        redactedPictures.push(picture);
      }
    });
    const picturesToDelete = editedReview.images?.filter(
      (prevPicture) =>
        redactedPictures.find(
          (redactedPicture) =>
            redactedPicture.imageLink === prevPicture.imageLink ||
            redactedPicture.preview === prevPicture.imageLink
        ) === undefined
    );

    await deleteImagesFromFirebaseCloud(picturesToDelete);
    const picturesUrl = await uploadImagesToFirebase(picturesToUpload);
    await addImagesToDatabase(picturesUrl, editedReview.id);
  };

  const formSubmit = async (values, resolve) => {
    dispatch(setIsLoading(true));
    let redactedReview = values;
    redactedReview.tags = redactedReview.tags.join(',');
    if (props?.review) {
      console.log('old', redactedReview);
      await handleToUpdate(redactedReview);
    } else {
      console.log('new', redactedReview);
      await handleToCreate(redactedReview);
    }
    dispatch(setIsLoading(false));
    resolve('onSubmitHandler complete');
  };

  return (
    <div>
      {isLoading ? <LoadingComponent /> : null}
      <Formik
        innerRef={props.formRef}
        initialValues={{
          title: props?.review?.title || '',
          authorScore: props?.review?.authorScore || 0,
          tags: props?.review?.tags?.split(',') || [],
          text: props?.review?.text || '',
          images: props?.review?.images || [],
          category: props?.review?.category || '',
        }}
        validationSchema={Yup.object({
          title: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
          authorScore: Yup.number()
            .max(5, 'Must be in range from 1 to 5')
            .min(1, 'Must be in range from 1 to 5')
            .required('Required'),
          category: Yup.string().matches('^(?!Select category$)', 'Required').required('Required'),
          text: Yup.string().required('Required'),
          tags: Yup.array().required('Required'),
          images: Yup.array(),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          return new Promise((resolve, reject) => {
            setSubmitting(true);
            console.log('submit...');
            resetForm();
            setSubmitting(false);
            formSubmit(values, resolve);
          });
        }}
      >
        {(props) => (
          <Form id='reviewForm'>
            <label htmlFor='title'>Title</label>
            <Field
              placeholder='Enter review title'
              style={{ width: '100%' }}
              name='title'
              type='text'
            />
            <ErrorMessage name='title' />

            <Row>
              <Col style={{ marginBottom: '10px' }} xs={4}>
                <label style={{ whiteSpace: 'nowrap' }} htmlFor='category'>
                  Category
                </label>
                <Field
                  style={{ width: '100%', height: '45px' }}
                  name='category'
                  as='select'
                  aria-label='Category'
                >
                  <option>Select category</option>
                  {options}
                </Field>
                <ErrorMessage name='category' />
              </Col>

              <Col xs={6}>
                <label style={{ whiteSpace: 'nowrap' }} htmlFor='tags'>
                  Tags
                </label>
                <Field name='tags' component={CustomMultiselect} tagsArray={tagsArray} />
                <ErrorMessage name='tags' />
              </Col>

              <Col xs={2}>
                <label htmlFor='authorScore'>Score</label>
                <Field style={{ width: '100%' }} name='authorScore' type='number' max='5' min='1' />
                <ErrorMessage name='authorScore' />
              </Col>

              <label htmlFor='text'>Text</label>
              <Field name='text' type='text'>
                {({ field, form }) => (
                  <ReactQuill
                    className='ql-editor'
                    theme='snow'
                    value={field.value}
                    modules={modules}
                    onChange={(value) => {
                      form.setFieldValue('text', value);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name='text' />

              <label htmlFor='images'>Pictures</label>
              <Field name='images' component={UploadImage} />
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};
