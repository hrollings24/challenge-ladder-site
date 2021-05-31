import React, { useState, useEffect, useRef } from "react"
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Container, Row, Col, Button , Modal, Alert, Form} from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import MainUser from "../../Persistance/MainUser"

export default function NavBar(usersname) {
    const [usersName, serUsersName] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState(false)
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const [signedIn, setSignedIn] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
    
        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            let userID = currentUser.uid;
            let user = MainUser.getInstance();
            await user.setUser(userID);
            setSignedIn(true)
        } catch {
            setError("Failed to log in")
        }
        setLoading(false)

        
      }

    useEffect(() => {
        if (signedIn) {
            history.push("/")
        }
    },[signedIn]);

    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                </Modal.Body>
            <Modal.Footer>

                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Log In
                </Button>
                </Modal.Footer>
            </Form>
            </Modal>

            <Navbar collapseOnSelect expand="lg" bg="transparent" variant="light">
            <Navbar.Brand href="#home">
                <img width="200px" height="auto" className="img-responsive" src="https://firebasestorage.googleapis.com/v0/b/challenger-ladder.appspot.com/o/long-01.png?alt=media&token=e694d857-571a-4df5-a24b-cd4add9786e0" alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
                <Nav>
                {!usersname.usersname ?
                <div class="collapse navbar-collapse" id="navbarSupportedContent2">
                    <Nav.Link onClick={handleShow}>Log In</Nav.Link>
                    <Nav.Link href="/signup">Sign Up</Nav.Link>

                </div> :
                <div>
                    <Nav.Link href="#deets">Welcome, {usersname.usersname}</Nav.Link>
                </div>
            }
                
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        </div>
    )
    
}
