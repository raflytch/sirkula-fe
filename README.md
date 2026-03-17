# Sirkula Client

## 🌱 Tentang Sirkula

**Sirkula** adalah platform digital berbasis AI untuk melakukan green action seperti pemilahan sampah, penanaman pohon, dan berbagai aksi ramah lingkungan lainnya.

### 🎯 Fitur Utama:

- ✅ **Verifikasi AI Otomatis** - Upload foto/video aksi hijau, AI akan memverifikasi secara otomatis
- 🎁 **Sistem Poin & Reward** - Dapatkan poin dari setiap aksi terverifikasi
- 🎫 **Tukar Voucher** - Tukarkan poin dengan voucher menarik dari UMKM ramah lingkungan
- 📊 **Dashboard Impact** - Lihat dampak kolektif dari aksi hijau Anda dan komunitas

### 🔑 Default Accounts

| Role  | Email            | Password    |
| ----- | ---------------- | ----------- |
| ADMIN | admin@sirkula.id | Admin123456 |
| DLH   | dlh@sirkula.id   | Dlh123456   |

---

## � Team Members

| Name                    | Role              |
| ----------------------- | ----------------- |
| **Rafly Aziz Abdillah** | Software Engineer |
| **Karina Ghaisani**     | Software Engineer |
| **Farhanah Basri**      | Business Analyst  |

---

## �🚀 Getting Started

### Prerequisites

Pastikan Anda telah menginstal:

- **Node.js** versi 18 atau lebih tinggi ([Download Node.js](https://nodejs.org/))
- **pnpm** (recommended) / npm / yarn
  ```bash
  # Install pnpm secara global
  npm install -g pnpm
  ```

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/raflytch/sirkula-client.git
   cd sirkula-client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   > Atau gunakan `npm install` / `yarn install` jika tidak menggunakan pnpm

### Environment Variables

1. **Copy file env.example menjadi .env.local**

   ```bash
   # Windows (PowerShell)
   Copy-Item env.example .env.local

   # Linux/Mac
   cp env.example .env.local
   ```

2. **Edit file .env.local dan sesuaikan dengan konfigurasi Anda**

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

   **Konfigurasi:**

   - `NEXT_PUBLIC_API_URL`: URL backend API Sirkula
     - Development: `http://localhost:8000/api`
     - Production: Sesuaikan dengan URL production API Anda

   > **Note:** Pastikan backend API sudah berjalan sebelum menjalankan aplikasi frontend

### Running the Application

1. **Development mode**

   ```bash
   pnpm dev
   ```

   Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

2. **Build for production**

   ```bash
   pnpm build
   ```

3. **Start production server**
   ```bash
   pnpm start
   ```

### Troubleshooting

**Error: Cannot find module**

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
pnpm install
```

**Error: Port 3000 already in use**

```bash
# Jalankan di port lain
pnpm dev -- -p 3001
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.jsx          # Root layout with providers
│   ├── page.jsx            # Home page (self-closing composite)
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # Shadcn UI components
├── composites/             # Page composites (main UI logic)
├── features/
│   ├── slices/             # Redux slices
│   └── store/              # Redux store configuration
├── hooks/                  # Custom React hooks
├── lib/
│   ├── http-client.js      # Axios instance with interceptors
│   └── utils.js            # Utility functions
├── providers/              # React context providers
│   ├── query-provider.jsx  # TanStack React Query provider
│   └── redux-provider.jsx  # Redux provider
└── services/               # API service functions
```

---

## 🔄 Development Workflow: Creating a New Page

Follow this flow when creating a new page:

### Flow: `Services → Hooks → Composites → Page`

> **Note:** If you need global state management (Redux), follow the extended flow:
> `Services → Slices → Store → Hooks → Composites → Page`

---

### 🔵 Basic Flow (React Query Only)

### Step 1: Create Service (`src/services/`)

```javascript
// src/services/example.service.js
import httpClient from "@/lib/http-client";

export const exampleService = {
  getAll: async () => {
    const response = await httpClient.get("/examples");
    return response.data;
  },

  getById: async (id) => {
    const response = await httpClient.get(`/examples/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await httpClient.post("/examples", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await httpClient.put(`/examples/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await httpClient.delete(`/examples/${id}`);
    return response.data;
  },
};
```

### Step 2: Create Hook (`src/hooks/`)

```javascript
// src/hooks/use-example.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { exampleService } from "@/services/example.service";
import { toast } from "sonner";

export const useExamples = () => {
  return useQuery({
    queryKey: ["examples"],
    queryFn: exampleService.getAll,
  });
};

export const useExample = (id) => {
  return useQuery({
    queryKey: ["example", id],
    queryFn: () => exampleService.getById(id),
    enabled: !!id,
  });
};

export const useCreateExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exampleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examples"] });
      toast.success("Example created successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create example");
    },
  });
};

export const useUpdateExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => exampleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examples"] });
      toast.success("Example updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update example");
    },
  });
};

export const useDeleteExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exampleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examples"] });
      toast.success("Example deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete example");
    },
  });
};
```

### Step 3: Create Composite (`src/composites/`)

```javascript
// src/composites/example.jsx
"use client";

import { useExamples, useCreateExample } from "@/hooks/use-example";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ExampleComposite() {
  const { data: examples, isLoading, error } = useExamples();
  const createExample = useCreateExample();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Examples</h1>

      <Button
        onClick={() => createExample.mutate({ name: "New Example" })}
        disabled={createExample.isPending}
      >
        {createExample.isPending ? "Creating..." : "Create Example"}
      </Button>

      <div className="grid gap-4 mt-6">
        {examples?.map((example) => (
          <div key={example.id} className="p-4 border rounded-lg">
            <h2 className="font-semibold">{example.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Create Page (`src/app/`)

```javascript
// src/app/example/page.jsx
import ExampleComposite from "@/composites/example";

export default function ExamplePage() {
  return <ExampleComposite />;
}
```

---

### 🟢 Extended Flow (With Redux State Management)

Use this flow when you need global state management:

`Services → Slices → Store → Hooks → Composites → Page`

### Step 1: Create Service (`src/services/`)

```javascript
// src/services/auth.service.js
import httpClient from "@/lib/http-client";

export const authService = {
  login: async (credentials) => {
    const response = await httpClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (data) => {
    const response = await httpClient.post("/auth/register", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await httpClient.get("/auth/profile");
    return response.data;
  },

  logout: async () => {
    const response = await httpClient.post("/auth/logout");
    return response.data;
  },
};
```

### Step 2: Create Slice (`src/features/slices/`)

```javascript
// src/features/slices/auth.slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setUser, setToken, setError, clearError, logout } =
  authSlice.actions;
export default authSlice.reducer;
```

### Step 3: Register in Store (`src/features/store/store.js`)

```javascript
// src/features/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice";
import authReducer from "../slices/auth.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
```

### Step 4: Create Hook (`src/hooks/`)

```javascript
// src/hooks/use-auth.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next";
import {
  setLoading,
  setUser,
  setToken,
  setError,
  clearError,
  logout as logoutAction,
} from "@/features/slices/auth.slice";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (credentials) => {
      try {
        dispatch(setLoading(true));
        const response = await authService.login(credentials);

        // Save token to cookie
        setCookie("token", response.data.token, { maxAge: 60 * 60 * 24 * 7 });

        dispatch(setToken(response.data.token));
        dispatch(setUser(response.data.user));

        toast.success("Login successful!");
        router.push("/dashboard");
        return true;
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Login failed";
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
        return false;
      }
    },
    [dispatch, router]
  );

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Continue logout even if API fails
    } finally {
      deleteCookie("token");
      dispatch(logoutAction());
      toast.success("Logged out successfully");
      router.push("/login");
    }
  }, [dispatch, router]);

  const getProfile = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await authService.getProfile();
      dispatch(setUser(response.data));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to get profile";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    }
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: handleLogout,
    getProfile,
    clearError: handleClearError,
  };
};
```

### Step 5: Create Composite (`src/composites/`)

```javascript
// src/composites/login.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginComposite() {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 6: Create Page (`src/app/`)

```javascript
// src/app/login/page.jsx
import LoginComposite from "@/composites/login";

export default function LoginPage() {
  return <LoginComposite />;
}
```

---

## 📊 When to Use Which Flow?

| Scenario                    | Flow                     |
| --------------------------- | ------------------------ |
| Simple data fetching (CRUD) | Basic Flow (React Query) |
| Authentication/User state   | Extended Flow (Redux)    |
| Shopping cart               | Extended Flow (Redux)    |
| Form data with server sync  | Basic Flow (React Query) |
| Theme/UI preferences        | Extended Flow (Redux)    |
| Real-time data              | Basic Flow (React Query) |
| Complex multi-step forms    | Extended Flow (Redux)    |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript (JSX)
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI
- **State Management:** Redux Toolkit
- **Data Fetching:** TanStack React Query (v5)
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Zod
- **Notifications:** Sonner (Toast)
- **Package Manager:** pnpm (recommended)

---

## 💻 System Requirements

- **Node.js:** 18.x or higher
- **pnpm:** 8.x or higher (or npm/yarn)
- **RAM:** Minimum 4GB
- **Disk Space:** Minimum 500MB

---

## 🔐 Authentication

The HTTP client (`src/lib/http-client.js`) handles authentication automatically:

- **Request Interceptor:** Adds `Authorization: Bearer <token>` header from cookies
- **Response Interceptor:** On 401 status, deletes token cookie and redirects to `/login`
- **No Token:** Redirects to `/login` if no token found in cookies

---

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

---

## 📝 License

MIT License - feel free to use this project for learning and development purposes.
