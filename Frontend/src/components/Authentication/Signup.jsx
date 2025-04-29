import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();  // Use navigate here

  const handleClick = () => setShowPassword(!showPassword);
  const handleConfirmClick = () => setShowConfirm(!showConfirm);

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "souravsanyal");

      fetch("https://api.cloudinary.com/v1_1/souravsanyal/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) {
            setPic(data.secure_url);
            toast({
              title: "Image uploaded successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Upload failed",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select a JPEG or PNG image",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Please enter a valid email",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      navigate("/chats");  // Use navigate instead of history.push
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Error during registration",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="4" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="signup-email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleConfirmClick}>
              {showConfirm ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        mt={4}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
