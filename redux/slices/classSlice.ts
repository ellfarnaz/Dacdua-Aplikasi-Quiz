import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Class } from "../../types";
import {
  createClass,
  getClasses,
  joinClass,
  getClassesForStudent,
  getClassesForDosen,
  getClassById,
} from "../../services/classService";
import { RootState } from "../store";

interface ClassState {
  classes: Class[];
  currentClass: Class | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  currentClass: null,
  loading: "idle",
  error: null,
};

export const createClassAsync = createAsyncThunk(
  "class/createClass",
  async (classData: Omit<Class, "id" | "createdAt">) => {
    const newClass = await createClass(classData);
    return newClass;
  }
);

export const getClassesAsync = createAsyncThunk(
  "class/getClasses",
  async (userId: string) => {
    const classes = await getClasses(userId);
    return classes;
  }
);

export const getClassByIdAsync = createAsyncThunk(
  "class/getClassById",
  async (classId: string) => {
    const classData = await getClassById(classId);
    return classData;
  }
);
export const joinClassAsync = createAsyncThunk(
  "class/joinClass",
  async ({ userId, classCode }: { userId: string; classCode: string }) => {
    const joinedClass = await joinClass(userId, classCode);
    return joinedClass;
  }
);

export const fetchStudentClassesAsync = createAsyncThunk<
  Class[],
  void,
  { state: RootState }
>("class/fetchStudentClasses", async (_, { getState }) => {
  const userId = getState().auth.user?.id;
  if (!userId) throw new Error("User not authenticated");
  return await getClassesForStudent(userId);
});

export const fetchDosenClassesAsync = createAsyncThunk<
  Class[],
  void,
  { state: RootState }
>("class/fetchDosenClasses", async (_, { getState }) => {
  const userId = getState().auth.user?.id;
  if (!userId) throw new Error("User not authenticated");
  return await getClassesForDosen(userId);
});

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setCurrentClass: (state, action: PayloadAction<Class | null>) => {
      state.currentClass = action.payload;
    },
    addClass: (state, action: PayloadAction<Class>) => {
      state.classes.push(action.payload);
    },
    updateClass: (state, action: PayloadAction<Class>) => {
      const index = state.classes.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = action.payload;
      }
    },
    setClasses: (state, action: PayloadAction<Class[]>) => {
      state.classes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClassAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createClassAsync.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.classes.push(action.payload);
      })
      .addCase(createClassAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getClassesAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getClassesAsync.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.classes = action.payload;
        // Update currentClass if it exists in the new classes array
        if (state.currentClass) {
          state.currentClass =
            action.payload.find((c) => c.id === state.currentClass?.id) || null;
        }
      })
      .addCase(getClassesAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || null;
      })
      .addCase(joinClassAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(joinClassAsync.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.classes.push(action.payload);
      })
      .addCase(joinClassAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || null;
      })
      .addCase(fetchStudentClassesAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchStudentClassesAsync.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.classes = action.payload;
      })
      .addCase(fetchStudentClassesAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || null;
      })
      .addCase(fetchDosenClassesAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDosenClassesAsync.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.classes = action.payload;
      })
      .addCase(fetchDosenClassesAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { setCurrentClass, addClass, updateClass, setClasses } =
  classSlice.actions;

export const selectClasses = (state: RootState) => state.class.classes;
export const selectCurrentClass = (state: RootState) =>
  state.class.currentClass;
export const selectClassLoading = (state: RootState) => state.class.loading;
export const selectClassError = (state: RootState) => state.class.error;
export const selectClassById = (state: RootState, classId: string) =>
  state.class.classes.find((c) => c.id === classId);

export default classSlice.reducer;
