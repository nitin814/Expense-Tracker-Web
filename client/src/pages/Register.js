import React , {useEffect} from 'react'
import {Form , Input , message} from 'antd'
import { Link , useNavigate} from 'react-router-dom'
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    const submitHandler = async (values) => {
      try{
        const {data} = await axios.post('/users/register' , values)
        message.success("Succesfully registered")
        console.log("oki"); 
        console.log(data.user);
        localStorage.setItem('user' , JSON.stringify({...data.user , password : ''}))
        navigate('/login');
      }
      catch(e)
      {
        message.error("invalid username or password")
        console.log(e);
      }
    }

    useEffect(()=> {
      if (localStorage.getItem('user'))
      {
        navigate('/');
      }
    },[navigate])
    

  return (
    <>
      <div className="register-page">
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Register Form</h1>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <Link to="/login">Already Register ?</Link>
            <button className="btn btn-primary">Register</button>
          </div>
        </Form>
      </div>
    </>
  
  )
}

export default Register