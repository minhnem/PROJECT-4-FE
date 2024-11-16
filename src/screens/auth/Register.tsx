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

type errors = {
  email?: string;
  password?: string;
  cfPassword?: string
}

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<errors>({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const inputCfPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate()

  let validateErrors: { email?: string; password?: string; cfPassword?: string }  = {};

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

  const validateConfirmPassWord = () => {
    const password = inputPasswordRef.current?.value || ""
    const cfPasswword = inputCfPasswordRef.current?.value || ""
    if (
      cfPasswword !== password || cfPasswword === ""
    ) {
      validateErrors.cfPassword = "Mật khẩu không khớp.";
    } else {
      delete validateErrors.cfPassword;
    }
  };

  const handleTouched = (fail: string) => {
    setTouched((prev) => ({ ...prev, [fail]: true }));
    validateErrors = { ...errors };

    if (fail === "email") validateEmail();
    if (fail === "password") validatePassword();
    if (fail === "confirmPassword") validateConfirmPassWord();
    setErrors(validateErrors);
  };

  //show password
  const handleShow = () => {
    setShowPassword(!showPassword);
  };


  const handleSignup = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    validateEmail();
    validatePassword();
    validateConfirmPassWord();
    setErrors(validateErrors);
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
              className={`form__group ${
                touched.email && errors.email ? "form__group--error" : ""
              }`}
            >
              <input
                ref={inputEmailRef}
                type="text"
                placeholder="Email"
                className="form__input"
                onBlur={() => handleTouched("email")}
              />
              <img src={iconEmail} alt="" className="form__icon" />
            </div>
            {errors.email && <p className="form__error">{errors.email}</p>}
            <div
              className={`form__group ${
                touched.password && errors.password ? "form__group--error" : ""
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
              <img src={iconPassword} alt="" className="form__icon" />
            </div>
            {errors.password && (
              <p className="form__error">{errors.password}</p>
            )}
            <div
              className={`form__group ${
                touched.confirmPassword && errors.cfPassword
                  ? "form__group--error"
                  : ""
              }`}
            >
              <input
                ref={inputCfPasswordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                className="form__input"
                onBlur={() => handleTouched("confirmPassword")}
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
              <img src={iconPassword} alt="" className="form__icon" />
            </div>
            {errors.cfPassword && (
              <p className="form__error">{errors.cfPassword}</p>
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