import axios from "axios";
import { router } from "expo-router";
import { Properties } from "../config/properties";
import { getToken, removeToken } from "../util/store";

const custom_axios = axios.create({
    baseURL: Properties.PRIVATE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Add request interceptor to include Authorization header
custom_axios.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log("signin error", error);
        return Promise.reject(error);
    }
);

// // Add response interceptor to handle errors globally
custom_axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status) {
            if (error.response.status === 401) {
                await removeToken();
                router.replace("/login");
            }
        }
        return Promise.reject(error);
    }
);


//login
export const signin = async (email: string, password: string) => {
    try {
        const response = await custom_axios.post("/login", { email, password });
        return response;
    } catch (error) {
        console.log("signin error", error);
        throw error;
    }
}

//signup
export const signup = async (data: any) => {
    try {
        const response = await custom_axios.post("/register", data);
        console.log("signup response", response.data);
        return response;
    } catch (error) {
        console.log("signup error", error);
        throw error;
    }
}

//verify user
export const verifyUser = async (token: string | null) => {
    try {
        const response = await custom_axios.patch(`/verify?token=${token}`);
        console.log("verify user response", response.data);
        return response;
    } catch (error) {
        console.log("verify user error", error);
        throw error;
    }
}

//get receivers
export const getReceivers = async () => {
    try {
        const response = await custom_axios.get("/users/receivers");
        return response;
    } catch (error) {
        console.log("get receivers error", error);
        throw error;
    }
}

//get chats
export const getChats = async (sender?: string, receiver?: string, groupId?: string) => {
    try {
        const queryParams = new URLSearchParams();
        if(sender) queryParams.append('sender', sender);
        if(receiver) queryParams.append('receiver', receiver);
        if(groupId) queryParams.append('groupId', groupId);
        const response = await custom_axios.get(`/chats?${queryParams.toString()}`);
        console.log("get chats response", response.data);
        return response;
    } catch (error) {
        console.log("get chats error", error);
        throw error;
    }
}

//add user
export const addUser = async (data: any) => {
    try {
        const response = await custom_axios.post("/users/receivers", data);
        console.log("add user response", response.data);
        return response;
    } catch (error) {
        console.log("add user error", error);
        throw error;
    }
}

//upload
export const upload = async (data: any) => {
    try {
        const response = await custom_axios.post("/upload", data);
        console.log("upload response", response.data);
        return response;
    } catch (error) {
        console.log("upload error", error);
        throw error;
    }
}

// Group APIs
export const getGroups = async () => {
    try {
        const response = await custom_axios.get("/groups");
        console.log("get groups response", response.data);
        return response;
    } catch (error) {
        console.log("get groups error", error);
        throw error;
    }
}

export const createGroup = async (data: any) => {
    try {
        const response = await custom_axios.post("/groups", data);
        console.log("create group response", response.data);
        return response;
    } catch (error) {
        console.log("create group error", error);
        throw error;
    }
}

export const addGroupMember = async (groupId: string, data: any) => {
    try {
        const response = await custom_axios.post(`/groups/${groupId}/members`, data);
        console.log("add group member response", response.data);
        return response;
    } catch (error) {
        console.log("add group member error", error);
        throw error;
    }
}

export const removeGroupMember = async (groupId: string, memberId: string) => {
    try {
        const response = await custom_axios.delete(`/groups/${groupId}/members/${memberId}`);
        console.log("remove group member response", response.data);
        return response;
    } catch (error) {
        console.log("remove group member error", error);
        throw error;
    }
}

export const getGroupDetails = async (groupId: string) => {
    try {
        const response = await custom_axios.get(`/groups/${groupId}`);
        console.log("get group details response", response.data);
        return response;
    } catch (error) {
        console.log("get group details error", error);
        throw error;
    }
}

export const getGroupMembers = async (groupId: string) => {
    try {
        const response = await custom_axios.get(`/groups/${groupId}/members`);
        console.log("get group members response", response.data);
        return response;
    } catch (error) {
        console.log("get group members error", error);
        throw error;
    }
}

export const updateGroupMemberRole = async (groupId: string, memberId: string, role: "admin" | "participant") => {
    try {
        const response = await custom_axios.put(`/groups/${groupId}/members/${memberId}/role`, { role });
        console.log("update group member role response", response.data);
        return response;
    } catch (error) {
        console.log("update group member role error", error);
        throw error;
    }
}

export const leaveGroup = async (groupId: string) => {
    try {
        const response = await custom_axios.post(`/groups/${groupId}/leave`);
        console.log("leave group response", response.data);
        return response;
    } catch (error) {
        console.log("leave group error", error);
        throw error;
    }
}

export const updateGroup = async (groupId: string, data: any) => {
    try {
        const response = await custom_axios.put(`/groups/${groupId}`, data);
        console.log("update group response", response.data);
        return response;
    } catch (error) {
        console.log("update group error", error);
        throw error;
    }
}