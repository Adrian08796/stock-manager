import React, { useEffect } from 'react';
import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup'; // Ensure Yup is imported correctly
import axios from 'axios';

const AutoSave = ({ stockToEdit }) => {
  const { setValues } = useFormikContext();

  useEffect(() => {
    if (stockToEdit) {
      setValues(stockToEdit);
    }
  }, [stockToEdit, setValues]);

  return null;
};

const AddStockForm = ({ stockToEdit, setStockToEdit, fetchStocks }) => {
  const initialValues = {
    productName: '',
    isOrganic: 'organic',
    quantity: '',
    measureUnit: 'Kilogram',
    pricePerUnit: '',
  };

  const validationSchema = Yup.object({
    productName: Yup.string().required('Product name is required'),
    quantity: Yup.number().required('Quantity is required').positive('Quantity must be a positive number'),
    measureUnit: Yup.string().required('Measure unit is required'),
    pricePerUnit: Yup.number().required('Price per unit is required').positive('Price must be a positive number'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (stockToEdit) {
        await axios.put(`http://localhost:4800/api/stocks/${stockToEdit._id}`, values);
        setStockToEdit(null);
      } else {
        await axios.post('http://localhost:4800/api/stocks', values);
      }
      resetForm();
      fetchStocks();
    } catch (error) {
      console.error('Error saving product', error);
    }
  };

  return (
    <div className="form-container">
      <h2>{stockToEdit ? 'Edit Stock' : 'Add Stock'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ setValues, errors, touched }) => (
          <>
            <AutoSave stockToEdit={stockToEdit} />
            <Form>
              <div>
                <label>Product name</label>
                <Field name="productName" placeholder="Product name..." />
                {errors.productName && touched.productName ? <div>{errors.productName}</div> : null}
              </div>
              <div className="radio-group">
                <label>Organic</label>
                <Field type="radio" name="isOrganic" value="organic" />
                <label>Not Organic</label>
                <Field type="radio" name="isOrganic" value="not-organic" />
              </div>
              <div>
                <label>Quantity</label>
                <Field name="quantity" placeholder="Quantity..." />
                {errors.quantity && touched.quantity ? <div>{errors.quantity}</div> : null}
              </div>
              <div>
                <label>Measure Unit</label>
                <Field as="select" name="measureUnit">
                  <option value="Kilogram">Kilogram</option>
                  <option value="Liter">Liter</option>
                  <option value="Piece">Piece</option>
                  <option value="Box">Box</option>
                </Field>
                {errors.measureUnit && touched.measureUnit ? <div>{errors.measureUnit}</div> : null}
              </div>
              <div>
                <label>Price per unit</label>
                <Field name="pricePerUnit" placeholder="Price per unit..." />
                {errors.pricePerUnit && touched.pricePerUnit ? <div>{errors.pricePerUnit}</div> : null}
              </div>
              <button type="submit">{stockToEdit ? 'Update Product' : 'Save Product'}</button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddStockForm;
