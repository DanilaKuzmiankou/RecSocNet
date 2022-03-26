import React from 'react';
import '../../App.css';
import { UploadImage, LoadingComponent, CustomMultiselect } from '../index.components';
import { useDispatch, useSelector } from 'react-redux';
import { setReviews, setSelectedReview } from '../../store/reducers/ReviewSlice';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Col, Row } from 'react-bootstrap';
import {
  addImagesToDatabase,
  deleteImagesFromFirebaseCloud,
  saveEditedReview,
  saveNewReview,
  uploadImagesToFirebaseCloud,
} from '../../api/store/ReviewStore';
import { setIsLoading } from '../../store/reducers/LoadingSlice';
import { modules, options } from '../../utils/Storage';
import { useTranslation } from 'react-i18next';

export const CreateOrEditReviewForm = (props) => {
  const isLoading = useSelector((state) => state.loading.isLoading);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { browsedUser } = useSelector((state) => state.user);
  const { reviews, editedReview } = useSelector((state) => state.review);
  const currentReview = Object.assign({}, editedReview);

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
      return await uploadImagesToFirebaseCloud(pictures);
    }
  };

  const getPicturesToDelete = (redactedPictures) => {
    return editedReview.images?.filter(
      (prevPicture) =>
        redactedPictures.find(
          (redactedPicture) =>
            redactedPicture.imageLink === prevPicture.imageLink ||
            redactedPicture.preview === prevPicture.imageLink
        ) === undefined
    );
  };
  const uploadOrDeletePictures = async (newReview) => {
    const allPictures = newReview.images;
    const picturesToUpload = allPictures.filter((pic) => pic.constructor === File);
    const redactedPictures = allPictures.filter((pic) => !picturesToUpload.includes(pic));
    const picturesToDelete = getPicturesToDelete(redactedPictures);

    await deleteImagesFromFirebaseCloud(picturesToDelete);
    const picturesUrl = await uploadImagesToFirebase(picturesToUpload);
    await addImagesToDatabase(picturesUrl, editedReview.id);
  };

  const formSubmit = async (values, resolve) => {
    dispatch(setIsLoading(true));
    const redactedReview = values;
    redactedReview.tags = redactedReview.tags.map((tag) => tag.trim()).join(',');
    if (Object.keys(currentReview).length !== 0) {
      await handleToUpdate(redactedReview);
    } else {
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
        enableReinitialize={true}
        initialValues={{
          title: currentReview?.title || '',
          authorScore: currentReview?.authorScore || '',
          tags: currentReview?.tags?.split(',') || [],
          text: currentReview?.text || '',
          images: currentReview?.images || [],
          category: currentReview?.category || '',
        }}
        validationSchema={Yup.object({
          title: Yup.string().max(100, t('must_be_100_characters_or_less')).required(t('required')),
          authorScore: Yup.number()
            .max(5, t('must_be_in_range_from_1_to_5'))
            .min(1, t('must_be_in_range_from_1_to_5'))
            .required(t('required')),
          category: Yup.string()
            .matches(`^(?!${t('select_category')}$)`, t('required'))
            .required(t('required')),
          text: Yup.string(),
          tags: Yup.array().required(t('required')),
          images: Yup.array(),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          return new Promise(async (resolve, reject) => {
            setSubmitting(true);
            resetForm();
            setSubmitting(false);
            await formSubmit(values, resolve);
          });
        }}
      >
        {({ errors, touched }) => (
          <Form id='reviewForm'>
            <label htmlFor='title'>{t('title')}</label>
            <Field
              placeholder={t('enter_review_title')}
              style={{ width: '100%' }}
              name='title'
              type='text'
              className={`${touched.title && errors.title ? 'error' : null} formik`}
            />
            <ErrorMessage component='div' className='custom_error_message' name='title' />

            <Row style={{ marginBottom: '10px', marginTop: '10px' }}>
              <Col xs={4}>
                <label style={{ whiteSpace: 'nowrap' }} htmlFor='category'>
                  {t('category')}
                </label>
                <Field
                  className={`${touched.title && errors.title ? 'error' : null} formik`}
                  style={{ width: '100%', height: '55px' }}
                  name='category'
                  as='select'
                >
                  <option>{t('select_category')}</option>
                  {options}
                </Field>
                <ErrorMessage component='div' className='custom_error_message' name='category' />
              </Col>

              <Col xs={6}>
                <label style={{ whiteSpace: 'nowrap' }} htmlFor='tags'>
                  {t('tags')}
                </label>
                <Field
                  name='tags'
                  className={`${touched.title && errors.title ? 'error' : null} formik`}
                  component={CustomMultiselect}
                />
                <ErrorMessage component='div' className='custom_error_message' name='tags' />
              </Col>

              <Col xs={2}>
                <label htmlFor='authorScore'>{t('score')}</label>
                <Field
                  className={`${touched.title && errors.title ? 'error' : null} formik`}
                  style={{ width: '100%', height: '55px' }}
                  name='authorScore'
                  type='number'
                  max='5'
                  min='1'
                />
                <ErrorMessage component='div' className='custom_error_message' name='authorScore' />
              </Col>

              <label style={{ paddingTop: '15px' }} htmlFor='text'>
                {t('text')}
              </label>
              <Field name='text' type='text'>
                {({ field, form }) => (
                  <ReactQuill
                    className='ql-editor'
                    theme='snow'
                    placeholder={t('enter_text')}
                    value={field.value}
                    modules={modules}
                    onChange={(value) => {
                      form.setFieldValue('text', value);
                    }}
                  />
                )}
              </Field>

              <label htmlFor='images'>{t('pictures')}</label>
              <Field
                className={`${touched.title && errors.title ? 'error' : null} formik`}
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
