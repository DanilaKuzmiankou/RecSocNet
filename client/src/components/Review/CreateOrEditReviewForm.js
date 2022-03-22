import React, { useEffect } from 'react';
import '../../App.css';
import { UploadImage } from '../UploadImage/UploadImage';
import { useDispatch, useSelector } from 'react-redux';
import { setReviews, setSelectedReview } from '../../store/reducers/ReviewSlice';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Col, Row } from 'react-bootstrap';
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
import { modules, options } from '../../utils/Storage';

export const CreateOrEditReviewForm = (props) => {
  const tagsArray = ['world war', 'fantasy', 'scam', 'politics'];

  const isLoading = useSelector((state) => state.loading.isLoading);

  const dispatch = useDispatch();
  const { browsedUser } = useSelector((state) => state.user);
  const { reviews, editedReview } = useSelector((state) => state.review);
  const currentReview = Object.assign({}, editedReview);

  useEffect(() => {}, [dispatch]);

  const handleToUpdate = async (newReview) => {
    await uploadOrDeletePictures(newReview);
    Object.assign(newReview, {
      id: editedReview.id,
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
    const redactedReview = values;
    redactedReview.tags = redactedReview.tags.join(',');
    if (Object.keys(currentReview).length !== 0) {
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
          title: currentReview?.title || '',
          authorScore: currentReview?.authorScore || '',
          tags: currentReview?.tags?.split(',') || [],
          text: currentReview?.text || '',
          images: currentReview?.images || [],
          category: currentReview?.category || '',
        }}
        validationSchema={Yup.object({
          title: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
          authorScore: Yup.number()
            .max(5, 'Must be in range from 1 to 5')
            .min(1, 'Must be in range from 1 to 5')
            .required('Required'),
          category: Yup.string().matches('^(?!Select category$)', 'Required').required('Required'),
          text: Yup.string(),
          tags: Yup.array().required('Required'),
          images: Yup.array(),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          return new Promise(async (resolve, reject) => {
            setSubmitting(true);
            console.log('submit...');
            resetForm();
            setSubmitting(false);
            await formSubmit(values, resolve);
          });
        }}
      >
        {({ errors, touched }) => (
          <Form id='reviewForm'>
            <label htmlFor='title'>Title</label>
            <Field
              placeholder='Enter review title'
              style={{ width: '100%' }}
              name='title'
              type='text'
              className={touched.title && errors.title ? 'error' : null}
            />
            <ErrorMessage component='div' className='custom_error_message' name='title' />

            <Row style={{ marginBottom: '10px', marginTop: '10px' }}>
              <Col xs={4}>
                <label style={{ whiteSpace: 'nowrap' }} htmlFor='category'>
                  Category
                </label>
                <Field
                  className={touched.category && errors.category ? 'error' : null}
                  style={{ width: '100%', height: '55px' }}
                  name='category'
                  as='select'
                  aria-label='Category'
                >
                  <option>Select category</option>
                  {options}
                </Field>
                <ErrorMessage component='div' className='custom_error_message' name='category' />
              </Col>

              <Col xs={6}>
                <label style={{ whiteSpace: 'nowrap' }} htmlFor='tags'>
                  Tags
                </label>
                <Field
                  name='tags'
                  className={touched.tags && errors.tags ? 'error' : null}
                  component={CustomMultiselect}
                  tagsArray={tagsArray}
                />
                <ErrorMessage component='div' className='custom_error_message' name='tags' />
              </Col>

              <Col xs={2}>
                <label htmlFor='authorScore'>Score</label>
                <Field
                  className={touched.authorScore && errors.authorScore ? 'error' : null}
                  style={{ width: '100%', height: '55px' }}
                  name='authorScore'
                  type='number'
                  max='5'
                  min='1'
                />
                <ErrorMessage component='div' className='custom_error_message' name='authorScore' />
              </Col>

              <label style={{ paddingTop: '15px' }} htmlFor='text'>
                Text
              </label>
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

              <label htmlFor='images'>Pictures</label>
              <Field
                className={touched.title && errors.title ? 'error' : null}
                name='images'
                component={UploadImage}
              />
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};
