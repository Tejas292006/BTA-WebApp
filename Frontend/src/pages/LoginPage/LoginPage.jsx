import './Login.css'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import { useFormik } from 'formik'
import { loginUser } from '../../apis/user'

const LoginPage = () => {

  const [activeBullet, setActiveBullet] = useState(1); // Add state for active bullet
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

  


  return (
    <div className='fixed h-screen w-screen bg-[#d8f275] z-50 text-[#fff] flex justify-center items-center'>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form autoComplete="off" className="sign-in-form">
              <div className="logo">
                <img src="https://i.pinimg.com/564x/80/86/7e/80867e01e51baed5f0a783dbcbe43f1e.jpg" alt="easyclass" />
                <h4>Textile Industries</h4>
              </div>
              <div className="heading">
                <h2>Welcome Back</h2>
                <div className="flex gap-1">
                  <h6>Not registred yet ?</h6>
                  <h6>Contact Admin</h6>
                </div>
              </div>
              <div className="actual-form">
                <div className="input-wrap">
                  <input type="email" placeholder='Email'  autoFocus {...formik.getFieldProps('email')} minLength={4} className="input-field" autoComplete="off" required />
                </div>
                <div className="input-wrap">
                  <input placeholder='Password'  {...formik.getFieldProps('password')} type="password" minLength={3} className="input-field" autoComplete="off" required />
                </div>
                <input onClick={formik.handleSubmit} type="submit" defaultValue="Sign In" className="sign-btn" />
                <p className="text">
                  Forgotten your password or you login datails? <br />
                  Contact Admin
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
            <div class="text-slider">
              <div class="text-wrap">
                <div class="text-group">
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
