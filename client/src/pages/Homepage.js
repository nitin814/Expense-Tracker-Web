import React , {useState , useEffect} from 'react'
import Layout from '../components/layouts/Layout'
import Analytics from '../components/Analytics'
import {Modal , Form, Select, message, Table , Input , DatePicker} from 'antd';
import axios from 'axios';
import moment from 'moment';
import {UnorderedListOutlined , AreaChartOutlined , EditOutlined , DeleteOutlined} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const Homepage = () => {

  const [alltransactions , setAlltransactions] = useState([])
  const [frequency , setFrequency] = useState('LAST 1 Week');
  const [selectedDate , setSelecteddate] = useState([]);
  const [type , setType] = useState('all');
  const [viewData , setViewData] = useState('table');
  const [edittable , setEdittable] = useState(null);
  const [showModel , setmodel] = useState(false);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Refrence",
      dataIndex: "refrence",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => { setEdittable(record); setmodel(true); }} />
          <DeleteOutlined className="mx-2" onClick={() => { handleDelete(record); }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {

    const showalltransactions = async () => {
      try 
      {
        const user = JSON.parse(localStorage.getItem('user'));
        const transactions = await axios.post('/transactions/gettransactions' , {userid : user._id , frequency , selectedDate , type})
        setAlltransactions(transactions.data)
      }
      catch(e)
      {
        message.error('Transaction fetching falied')
      }
    }

    showalltransactions();
  }, [frequency , selectedDate , type])

  const handleDelete = async (record) => {
      try 
      {
        await axios.post('/transactions/deletetransactions' , {transactionid : record._id})
        message.success('Transaction deleted successfully');
      }
      catch(e)
      {
        message.error("Transaction deletion failed")
      }
  };

  const handleSubmit = async (values) => {
    try
    {
      console.log(values);
      const user = JSON.parse(localStorage.getItem('user'));
      if (edittable)
      {
        await axios.post('/transactions/edittransactions' , {payload : {...values , userid : user._id} , transactionid : edittable._id})
        message.success('Transaction updated succesfully')
      }
      else
      {
        await axios.post('/transactions/addtransactions' , {...values , userid : user._id})
        message.success('Transaction added succesfully')
      }
      setmodel(false);
      setEdittable(null);
    }
    catch(e)
    {
      console.log(e);
      message.error('Transaction addition falied')
    }
  }

  return (
    <Layout>

        <div className='filters'>
          <div>
              <h6>Select Frequency</h6>
                <Select value={frequency} onChange={(values) => setFrequency(values)}>
                  <Select.Option value="7">LAST 1 Week</Select.Option>
                  <Select.Option value="30">LAST 1 Month</Select.Option>
                  <Select.Option value="365">LAST 1 year</Select.Option>
                  <Select.Option value="custom">custom</Select.Option>
                </Select>
                
              {frequency === "custom" && (
                    < RangePicker value={selectedDate} onChange={(values) => setSelecteddate(values)} />
            )}
          </div>
        
          <div className="filter-tab">
              <h6>Select Type</h6>
                <Select value={type} onChange={(values) => setType(values)}>
                  <Select.Option value="all">All</Select.Option>
                  <Select.Option value="income">Income</Select.Option>
                  <Select.Option value="expense">Expense</Select.Option>
                </Select>
                
              {frequency === "custom" && (
                    < RangePicker value={selectedDate} onChange={(values) => setSelecteddate(values)} />
            )}
          </div>
        
          <div className="switch-icons">
            <UnorderedListOutlined className={`mx-2 ${ viewData === "table" ? "active-icon" : "inactive-icon"}`}
                onClick={() => setViewData("table")} />
            <AreaChartOutlined className={`mx-2 ${ viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
                onClick={() => setViewData("analytics")} />
          </div>

        <div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => { setEdittable(null); setmodel(true);}}>
              Add New
            </button>
          </div>
        </div>
        </div>

      <div className='content'>
        {viewData === "table" ? <Table columns={columns} dataSource={alltransactions}></Table> 
          : <Analytics alltransactions = {alltransactions} />}
      </div>

      <Modal title={edittable ? 'Edit Transaction' : 'Add Transaction'} open={showModel} onCancel={() => {setmodel(false)}} footer={false}>
        <Form layout='vertical' onFinish={handleSubmit} initialValues={edittable}>
          <Form.Item label="amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Refrence" name="refrence">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" required />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  )
}

export default Homepage