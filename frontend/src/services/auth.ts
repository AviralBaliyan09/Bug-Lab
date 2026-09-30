import api from "./api"
import type{
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    User,
} from "../types/auth";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/users/login",
    data
  );

  return response.data;
}

export async function register(
  data: RegisterRequest
): Promise<User> {
  const response = await api.post<User>(
    "/users/register",
    data
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>(
    "/users/me"
  );

  return response.data;
}

export async function getUsers(
  search?: string,
  role?: string
): Promise<User[]> {
  const response = await api.get<User[]>(
    "/users/",
    {
      params: {
        search: search || undefined,
        role:
          role === "ALL"
            ? undefined
            : role,
      },
    }
  );

  return response.data;
}

export async function updateUserRole(
  userId: number,
  role: User["role"]
): Promise<User> {
  const response = await api.patch<User>(
    `/users/${userId}/role`,
    {
      role,
    }
  );

  return response.data;
}


export async function deleteUser(
  userId: number
): Promise<void> {
  await api.delete(
    `/users/${userId}`
  );
}