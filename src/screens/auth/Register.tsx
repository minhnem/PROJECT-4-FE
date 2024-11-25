import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./auth.scss"
import logo from "../../assets/img/Logo2.png"
import iconEmail from "../../assets/icons/icon-email.svg";
import iconPassword from "../../assets/icons/icon-password.svg";
import iconGmail from "../../assets/icons/icon-gmail.svg";
import intro from "../../assets/img/intro.svg";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiLock } from "react-icons/fi";
import handleAPI from '../../apis/handleAPI';

type errors = {
  email?: string;
  password?: string;
  userName?: string
}
//sửa
const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<errors>({});
  const [touched, setTouched] = useState({
    userName: false,
    email: false,
    password: false,
  });

  const inputUserNameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate()

  let validateErrors: { email?: string; password?: string; userName?: string } = {};

  const validateUserName = () => {
    const userName = inputUserNameRef.current?.value || ""
    if (/[^a-zA-Z0-9@._\s-]/.test(userName)) {
      validateErrors.userName = "Tên người dùng không được chứa kí tự đực biệt.";
    } else if ( userName.trim() === "" ){
      validateErrors.userName = "Tên người dùng không được bỏ trống.";
    } else {
      delete validateErrors.userName;
    }
  };

  const validateEmail = () => {
    const email = inputEmailRef.current?.value || ""
    if (/[^a-zA-Z0-9@._-]/.test(email) || email === "") {
      validateErrors.email = "Email không được để trống hoặc chứa ký tự đặc biệt.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validateErrors.email = "Email không hợp lệ.";
    } else {
      delete validateErrors.email;
    }
  };

  const validatePassword = () => {
    const password = inputPasswordRef.current?.value || ""
    if (/[^a-zA-Z0-9@._-]/.test(password) || password === "") {
      validateErrors.password = "Mật khẩu không được bỏ trống hoặc chứa ký tự đặc biệt.";
    } else if (password.length < 8) {
      validateErrors.password = "Mật khẩu phải chứa ít nhất 8 ký tự.";
    } else {
      delete validateErrors.password;
    }
  };

  const handleTouched = (fail: string) => {
    setTouched((prev) => ({ ...prev, [fail]: true }));
    validateErrors = { ...errors };

    if (fail === "userName") validateUserName();
    if (fail === "email") validateEmail();
    if (fail === "password") validatePassword();
    setErrors(validateErrors);
  };

  //show password
  const handleShow = () => {
    setShowPassword(!showPassword);
  };


  const handleSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    validateUserName();
    validateEmail();
    validatePassword();
    setErrors(validateErrors);
    if (Object.keys(errors).length === 0) {
      const userName = inputUserNameRef.current?.value
      const email = inputEmailRef.current?.value
      const password = inputPasswordRef.current?.value
      const values = { userName: userName, email: email, password: password  }
      try {
        const res = await handleAPI("/auth/register", values, "post")
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="auth min-h-[100vh] grid grid-rows-1 grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block bg-[#cccccc36]">
        <div className="auth__intro">
          <img src={intro} alt="" className="auth__intro-img" />
          <p className="auth__intro-desc max-w-[460px] text-center text-[20px] font-[600]">
            Hãy đăng ký tài khoản để đến với những sản phẩm tốt nhất, chất lượng
            cao và trải nhiệm dịch vụ sáng tạo của chúng tôi.
          </p>
        </div>
      </div>
      <div className="auth__content flex justify-center items-center">
        <div className="auth__content-inner">
          <a href="" className="auth__link-logo">
            <img src={logo} alt="" className="auth__logo" />
          </a>
          <h1 className="auth__heading">Đăng Ký</h1>
          <p className="auth__desc mb-[40px] text-center">
            Hãy đăng ký tài khoản và đến với những sản phẩm của chúng tôi.
          </p>
          <form action="" className="form auth__form">

            <div
              className={`form__group ${touched.userName && errors.userName
                  ? "form__group--error"
                  : ""
                }`}
            >
              <input
                ref={inputUserNameRef}
                type="text"
                placeholder="Tên người dùng"
                className="form__input"
                onBlur={() => handleTouched("userName")}
              />
              <FaRegUser className="form__icon-show"/>
            </div>
            {errors.userName && (
              <p className="form__error">{errors.userName}</p>
            )}

            <div
              className={`form__group ${touched.email && errors.email ? "form__group--error" : ""
                }`}
            >
              <input
                ref={inputEmailRef}
                type="text"
                placeholder="Email"
                className="form__input"
                onBlur={() => handleTouched("email")}
              />
              <HiOutlineMail className="form__icon-show"/>
            </div>
            {errors.email && <p className="form__error">{errors.email}</p>}

            <div
              className={`form__group ${touched.password && errors.password ? "form__group--error" : ""
                }`}
            >
              <input
                ref={inputPasswordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="form__input"
                onBlur={() => handleTouched("password")}
              />
              {showPassword ? (
                <FaRegEye
                  className="form__icon-show"
                  onClick={() => handleShow()}
                />
              ) : (
                <FaRegEyeSlash
                  className="form__icon-show"
                  onClick={() => handleShow()}
                />
              )}
              <FiLock className="form__icon-show"/>
            </div>
            {errors.password && (
              <p className="form__error">{errors.password}</p>
            )}

            <a href="" className="auth__link block text-end">
              Quên mật khẩu
            </a>
            <button
              className="auth__btn mb-[20px] bg-[#FFD44D]"
              onClick={handleSignup}
            >
              Đăng ký
            </button>
            <button className="auth__btn mb-[50px] auth__btn--gmail">
              <img src={iconGmail} alt="" className="auth__icon-gmail" />
              Đăng ký bằng Gmail
            </button>
          </form>
          <div className="auth__line">
            <p className="auth__desc">Bạn đã có tài khoản chưa?</p>
            <Link to={"/Login"} className="auth__link-signin">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register
