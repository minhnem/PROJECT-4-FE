import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "../../assets/scss/auth.scss"
import logo from "../../assets/img/Logo2.png"
import iconGmail from "../../assets/icons/icon-gmail.svg";
import intro from "../../assets/img/intro.svg";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { FiLock } from "react-icons/fi";
import handleAPI from '../../apis/handleAPI';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/authReducer';
import { localDataNames } from '../../constants/appInfos';
import { message } from 'antd';
import { signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/contacts.readonly')


type errors = {
  email?: string;
  password?: string;
}

const Login = () => {
  const [isRemember, setIsRemember] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<errors>({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const dispatch = useDispatch()

  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  let validateErrors: { email?: string; password?: string } = {};

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

    if (fail === "email") validateEmail();
    if (fail === "password") validatePassword();
    setErrors(validateErrors);
  };


  const handleShow = () => {
    setShowPassword(!showPassword);
  };
   

  const handleLoginWithGoogle = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider)
      if(result) {       
        const user = result.user
        if(user) {
          const data = {
            name: user.displayName,
            email: user.email,
            password: "12345"
          }
          try {
            const res: any = await handleAPI("/auth/google-login", data, "post")
            message.success(res.message)
            dispatch(addAuth(res.data))
            localStorage.setItem(localDataNames.authData, JSON.stringify(res.data))
          } catch (error: any) {
            console.log(error);
            message.error(error.message)
          }
        }
      }else {
        console.log("Không thể đăng nhập với Google")
      }
    } catch (error) {
      console.log(error)
    } 
  }

  const handleSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    validateEmail();
    validatePassword();
    setErrors(validateErrors);
    if (Object.keys(errors).length === 0) {
      const email = inputEmailRef.current?.value
      const password = inputPasswordRef.current?.value
      const values = { email: email, password: password }
      try {
        const res: any = await handleAPI("/auth/login", values, "post")
        message.success(res.message)
        res && dispatch(addAuth(res.data))
        if (isRemember) {
          localStorage.setItem(localDataNames.authData, JSON.stringify(res.data))
        }
      } catch (error: any) {
        message.error(error.message)
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
            Chào mừng bạn quay lại để đăng nhập. Là khách hàng quay lại, bạn có thể truy cập vào tất cả thông tin đã lưu trước đó.
          </p>
        </div>
      </div>
      <div className="auth__content flex justify-center items-center">
        <div className="auth__content-inner">
          <a href="" className="auth__link-logo">
            <img src={logo} alt="" className="auth__logo" />
          </a>
          <h1 className="auth__heading">Đăng Nhập</h1>
          <p className="auth__desc mb-[40px] text-center">
            Hãy đăng nhập và đến với những sản phẩm của chúng tôi.
          </p>
          <form action="" className="form auth__form">

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
              <HiOutlineMail className="form__icon-show" />
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
              <FiLock className="form__icon-show" />
            </div>
            {errors.password && (
              <p className="form__error">{errors.password}</p>
            )}

            <div className='form__checkbox'>
              <div className='form__line'>
                <input type="checkbox" checked={isRemember} onChange={(e)=> setIsRemember(e.target.checked)}/>
                <span>Remember me</span>
              </div>
              <a href="#!" className='form__link'>Recovery Password</a>
            </div>

            <button
              className="auth__btn mb-[20px] bg-[#FFD44D]"
              onClick={handleSignup}
            >
              Đăng nhập
            </button>
            <button className="auth__btn mb-[50px] auth__btn--gmail" onClick={handleLoginWithGoogle}>
              <img src={iconGmail} alt="" className="auth__icon-gmail" />
              Đăng nhập bằng Gmail
            </button>
          </form>
          <div className="auth__line">
            <p className="auth__desc">Bạn đã có tài khoản chưa?</p>
            <Link to={"/register"} className="auth__link-signin">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login
