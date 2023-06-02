import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAuth from "../services/apiAuth.js";

const imgContext = createContext()

export function ImgProvider({ children }) {
    const [userProfileImage, setUserProfileImage] = useState()
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token")
            if (token === null) {
                setUserProfileImage("")
                return navigate('/')
            }
            const photoUrl = await apiAuth.getUserPhoto(token)
            if (photoUrl.status === 200) {
                const avatarUrl = photoUrl.data.avatar
                setUserProfileImage(() => avatarUrl)
            }
        })()

    }, [])
    return (<imgContext.Provider value={{ userProfileImage }}>
        {children}
    </imgContext.Provider>)
}

export function usePhoto() {
    const photoCtx = useContext(imgContext)
    return photoCtx
}