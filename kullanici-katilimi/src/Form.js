import { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

function Form(props) {
  const initialForm = {
    name: "",
    email: "",
    password: "",
    agreement: false,
  };

  const [yeniUye, setyeniUye] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    kontrolFonksiyonu(yeniUye);
  }, [yeniUye]);

  const kontrolFonksiyonuAlanlar = (name, value) => {
    yup
      .reach(schema, name)
      .validate(value)
      .then((valid) => {
        const newErrorState = {
          ...formErrors,
          [name]: "",
        };
        setFormErrors(newErrorState);
      })
      .catch(function (err) {
        //err.errors;
        console.log("error:  ", err.name, err.errors[0]);

        const newErrorState = {
          ...formErrors,

          [name]: err.errors[0],
        };
        setFormErrors(newErrorState);
      });
  };

  const kontrolFonksiyonu = (usersData) => {
    schema.isValid(usersData).then(function (valid) {
      console.log(valid, "valid");
      if (valid === true) {
        console.log("Axios ile sunucuya gönderilebilir buton aktif edilebilir");
        setIsDisabled(false);
      } else {
        console.log("hataMesajıGörüntüle");
        setIsDisabled(true);
      }
    });
  };

  let schema = yup.object().shape({
    name: yup
      .string()
      .required("En az üç harfli bir isimin olmalı")
      .min(3, "Daha kısa bir isim olamaz mı? En az 3 karakter lütfen"),
    email: yup
      .string()
      .email("Eposta adresin yanlış gözüküyor")
      .required("Email lazım"),
    password: yup
      .string()
      .required("Bir şifre girmelisin kesinn!!")
      .min(6, "Şifreniz en az 6 olmazsa kolay hacklenir")
      .matches(/[^0-9]/, "Şifre sadece sayı olamaz harf falan ekle"),
    agreement: yup
      .boolean()
      .oneOf([true], "Kullanım koşullarını kabul etmelisiniz"),
  });

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    let newValue = type === "checkbox" ? checked : value;
    const newState = {
      ...yeniUye,
      [name]: newValue,
    };

    setyeniUye(newState);
    kontrolFonksiyonu(newState);
    kontrolFonksiyonuAlanlar(name, newValue);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("submitted", event);
    if (isDisabled === false) {
      axios
        .post("https://reqres.in/api/users", yeniUye)
        .then(function (response) {
          console.log(response, "response");
          props.addUser(response.data);
        })
        .catch(function (error) {
          console.log(error, "error");
          alert("Gönderilemedi");
        });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="name">İsim:</label>
        <input
          value={yeniUye.name}
          onChange={changeHandler}
          type="text"
          id="name"
          name="name"
        />
        {formErrors.name && <p className="error">{formErrors.name}</p>}
      </div>
      <div>
        <label htmlFor="email">Eposta:</label>
        <input
          value={yeniUye.email}
          onChange={changeHandler}
          type="email"
          id="email"
          name="email"
        />
        {formErrors.email && <p className="error">{formErrors.email}</p>}
      </div>
      <div>
        <label htmlFor="pass">Şifre:</label>
        <input
          value={yeniUye.password}
          onChange={changeHandler}
          type="password"
          id="password"
          name="password"
        />
        {formErrors.password && <p className="error">{formErrors.password}</p>}
      </div>
      <div>
        <label htmlFor="terms">Şartları kabul ediniz:</label>
        <input
          value={yeniUye.agreement}
          onChange={changeHandler}
          type="checkbox"
          id="agreement"
          name="agreement"
        />
        {formErrors.agreement && (
          <p className="error">{formErrors.agreement}</p>
        )}
      </div>
      <button disabled={isDisabled} type="submit">
        Gönder
      </button>
    </form>
  );
}

export default Form;
