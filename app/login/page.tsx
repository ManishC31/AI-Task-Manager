'use client';
import { useRouter } from "next/navigation";
import { useState } from "react"



function LoginPage(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const handleLogin = async() => {

    }

    return (
        <div>
        
        
        </div>
    )
}

export default LoginPage