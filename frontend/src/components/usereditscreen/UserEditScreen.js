import React, {useContext, useEffect, useReducer, useState} from 'react';
import {Store} from "../../Store";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {getError} from "../../utils";
import {toast} from "react-toastify";
import Container from "react-bootstrap/Container";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true};
        case 'FETCH_SUCCESS':
            return { ...state, loading: false};
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload};
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true};
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false};
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false};
        default:
            return state;
    }
};

export default function UserEditScreen() {

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const {state} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();
    const params = useParams(); // /product/:id
    const { id: userId } = params;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}`},
                });
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                dispatch({ type: 'FETCH_SUCCESS'});
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error)})
            }
        }
        fetchData();
    }, [userId, userInfo]);

    const  submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(`/api/users/${userId}`,
                {_id: userId, name, email, isAdmin},
            {
                headers: { Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({ type: 'UPDATE_SUCCESS'});
            toast.success('Người dùng đã được cập nhật thành công');
            navigate('/admin/users');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPDATE_FAIL'})
        }
    };

    return <Container className="small-container row">
        <Helmet>
            <title>Chỉnh sửa người dùng ${userId}</title>
        </Helmet>
        <h1>Chỉnh sửa người dùng {userId}</h1>

        { loading ? (
            <LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Check className="mb-3" type="checkbox" id="isAdmin" label="isAdmin" checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <div className="mb-3">
                    <Button disabled={loadingUpdate} type="submit">Cập nhật</Button>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                </div>
            </Form>
        )}
    </Container>
}