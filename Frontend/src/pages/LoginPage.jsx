import './Login.css'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import { useFormik } from 'formik'
import { loginUser, registerUser } from '../api'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const LoginPage = () => {

  const [activeBullet, setActiveBullet] = useState(1); // Add state for active bullet
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const moveSlider = (index) => {
    const currentImage = document.querySelector(`.img-${index}`);
    const images = document.querySelectorAll(".image");
    images.forEach((img) => img.classList.remove("show"));
    currentImage.classList.add("show");

    const textSlider = document.querySelector(".text-group");
    textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
    setActiveBullet(index); // Update active bullet state
  };


  const logInOnFinish = async (values) => {
    try {

      const response = await loginUser(values);

      if (response.success) {
        localStorage.setItem("token", response.token);
        toast.success('Logged In successfully')
        navigate("/")
      }
      else {
        throw new Error(response.message);
      }

    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  const registerOnFinish = async (values) => {
    try {

      const response = await registerUser(values);

      if (response.success) {
        toast.success('Account created successfully! Please sign in.')
        setIsSignUp(false);
      }
      else {
        throw new Error(response.message);
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/")
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      await logInOnFinish(values)
    },

  })

  const signUpFormik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },

    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      await registerOnFinish(values)
    },

  })




  return (
    <div className='fixed h-screen w-screen bg-[#d8f275] dark:bg-[#15141f] z-50 text-[#fff] flex justify-center items-center'>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form autoComplete="off" className={`sign-in-form ${isSignUp ? 'hide' : ''}`} onSubmit={formik.handleSubmit}>
              <div className="logo">
                <img src="https://i.pinimg.com/564x/80/86/7e/80867e01e51baed5f0a783dbcbe43f1e.jpg" alt="easyclass" />
                <h4>Textile Industries</h4>
              </div>
              <div className="heading">
                <h2>Welcome Back</h2>
                <div className="flex gap-1">
                  <h6>Not registered yet ?</h6>
                  <button type="button" className="toggle" onClick={() => setIsSignUp(true)}>Sign Up</button>
                </div>
              </div>
              <div className="actual-form">
                <div className="input-wrap">
                  <input type="email" placeholder='Email' autoFocus {...formik.getFieldProps('email')} minLength={4} className="input-field" autoComplete="off" required />
                </div>
                <div className="input-wrap">
                  <input placeholder='Password' {...formik.getFieldProps('password')} type={showPassword ? 'text' : 'password'} minLength={3} className="input-field" autoComplete="off" required />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <input type="submit" defaultValue="Sign In" className="sign-btn" />
                <p className="text">
                  Forgotten your password or you login datails? <br />
                  Contact Admin
                </p>
              </div>
            </form>

            <form autoComplete="off" className={`sign-up-form ${isSignUp ? 'show' : ''}`} onSubmit={signUpFormik.handleSubmit}>
              <div className="logo">
                <img src="https://i.pinimg.com/564x/80/86/7e/80867e01e51baed5f0a783dbcbe43f1e.jpg" alt="easyclass" />
                <h4>Textile Industries</h4>
              </div>
              <div className="heading">
                <h2>Create Account</h2>
                <div className="flex gap-1">
                  <h6>Already registered ?</h6>
                  <button type="button" className="toggle" onClick={() => setIsSignUp(false)}>Sign In</button>
                </div>
              </div>
              <div className="actual-form">
                <div className="input-wrap">
                  <input type="text" placeholder='Username' {...signUpFormik.getFieldProps('username')} minLength={3} className="input-field" autoComplete="off" required />
                </div>
                <div className="input-wrap">
                  <input type="email" placeholder='Email' {...signUpFormik.getFieldProps('email')} minLength={4} className="input-field" autoComplete="off" required />
                </div>
                <div className="input-wrap">
                  <input placeholder='Password' {...signUpFormik.getFieldProps('password')} type={showSignUpPassword ? 'text' : 'password'} minLength={3} className="input-field" autoComplete="off" required />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignUpPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignUpPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <input type="submit" defaultValue="Sign Up" className="sign-btn" />
                <p className="text">
                  New accounts are created instantly.<br />
                </p>
              </div>
            </form>
          </div>
          <div className="carousel">
            <div className="images-wrapper">
              <img src="https://res.cloudinary.com/dylnk52kz/image/upload/v1707810632/image1_skyp3w.png" className="image img-1 show" alt />
              <img src="https://res.cloudinary.com/dylnk52kz/image/upload/v1707810632/image2_snc2z4.png" className="image img-2" alt />
              <img src="https://i.pinimg.com/564x/b7/ef/2f/b7ef2ff50453d559703c35c21a9aaaf3.jpg" className="image img-3" alt />
            </div>
            <div className="text-slider">
              <div className="text-wrap">
                <div className="text-group">
                  <h2>Create your Partner</h2>
                  <h2>Customize as you like</h2>
                  <h2>Increase Growth</h2>
                </div>
              </div>

              <div className="bullets">
                <span className={activeBullet === 1 ? "active" : ""} onClick={() => moveSlider(1)} />
                <span className={activeBullet === 2 ? "active" : ""} onClick={() => moveSlider(2)} />
                <span className={activeBullet === 3 ? "active" : ""} onClick={() => moveSlider(3)} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LoginPage