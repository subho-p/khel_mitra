"use client";

import * as React from "react";

import { AuthCardWrapper, SigninForm } from "../_components";

const SignInPage: React.FC = ({}) => {
    return (
        <div>
            <AuthCardWrapper headerText="Welcome back">
                <SigninForm />
            </AuthCardWrapper>
        </div>
    );
};

export default SignInPage;
