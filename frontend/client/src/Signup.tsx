// Signup.tsx

import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

interface SignupProps {
  handleSignup: (username: string, password: string) => void;
}

const SignupPage: React.FC<SignupProps> = ({ handleSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignup(username, password);
  };

  return (
    <div className="signup-container">
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input type="text" name="username" id="username" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" name="password" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </FormGroup>
        <Button>Sign Up</Button>
      </Form>
    </div>
  );
};

export default SignupPage;
