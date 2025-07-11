import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from '../assets/assets';
import toast from "react-hot-toast";
import axios from "axios"


// for sending cookies in api req
axios.defaults.withCredentials = true; 
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL 

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});
    const currency = import.meta.env.VITE_CURRENCY

        // fetch seller status
        const fetchSeller = async () => {
            try {
              const { data } = await axios.get("/api/seller/is-auth"); 
             
             if(data.success){

                setIsSeller(true); 
            }else{
                setIsSeller(false)
            }
            } catch (error) {
              setIsSeller(false); 
            }
          };
          



    // ============================
    // Fetch Product
    // ============================

    const fetchProduct = async () => {
        // setProducts(dummyProducts)

        try {
            const {data}= await axios.get('/api/product/list' )
            if(data.success){
                setProducts(data.product)
            }else{

            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // ============================
    // Add Product to cart
    // ============================

    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart");

    }

    // ============================
    // Update CArt Item Quantity
    // ============================

    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("Cart Updated")
    }

    // ============================
    // Remove Product From CArt
    // ============================

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId]
            }
        }
        toast.success("Removed from Cart")
        setCartItems(cartData)
    }

    // ============================
    // Get Cart Items Count
    // ============================

    const getCartCount = () => {
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item]
        }
        return totalCount;
    }

    
    // ============================
    // Get Cart Total Amount 
    // ============================

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items)
            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }

        return Math.floor(totalAmount * 100)/100;
    }
// fetch user auth status  user data and cart items 

const fetchUser= async ()=>{
    try {
        const {data}= await axios.get('/api/user/is-auth')
        if(data.success){
            setUser(data.user)
            setCartItems(data.user.cart)
        }
    } catch (error) {
        setUser(null);
    }
}



    useEffect(() => {
        fetchUser()
        fetchProduct()
        fetchSeller()
    }, []);


    const value = { user, setUser, isSeller, setIsSeller,
         navigate, showUserLogin, setShowUserLogin,
          products, cartItems, addToCart,
           updateCartItem, removeFromCart,
            searchQuery, setSearchQuery,
            getCartCount,getCartAmount,axios, fetchProduct  }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}