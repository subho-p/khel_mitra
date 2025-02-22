"use client";

import * as React from "react";

import { AuthCardWrapper, SignupForm } from "../_components";

const SignInPage: React.FC = ({}) => {
    return (
        <div>
            <AuthCardWrapper headerText="Create new account">
                <SignupForm />
            </AuthCardWrapper>
        </div>
    );
};

export default SignInPage;
