
import React, { PropsWithChildren, useCallback, createContext, useContext, useState } from 'react'

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export type Task = {
    id: string;
    name: string;
    isCompleted: boolean;
    isImportant: boolean;
}

type TasksContextType = {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    completedTasks: Task[];
    setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    starId: string;
    setStarId: any;
    selectedItem: any;
    setSelectedItem: any;
    star: Task[];
    setStar: React.Dispatch<React.SetStateAction<Task[]>>;
    starredTasks: Task[];
    setStarredTasks: any;
    allTasks: Task[];
    setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    currentTaskName: String;
    setCurrentTaskName: any;
    selectedDueDate: any;
    setSelectedDueDate: any;
    dueDate: String;
    setDueDate: any;
    showCompletedDropdown: boolean;
    setShowCompletedDropdown:any;
    myDay: boolean,
    setMyDay:any;
    myDayState:boolean;
    setMyDayState: any;
    dueDateAdded: any;
    setDueDateAdded: any;
};

const TasksContextProvider = ({ children }: PropsWithChildren<{}>) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [starId, setStarId] = useState('');
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [currentTaskName, setCurrentTaskName] = useState('');
    const [myDay,setMyDay] = useState(false);
    const [dueDateAdded,setDueDateAdded] = useState()
    const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [star, setStar] = useState<Task[]>([]);
    const [starredTasks, setStarredTasks] = useState<Task[]>([]);
    const [selectedDueDate, setSelectedDueDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [myDayState,setMyDayState] = useState(false)
    return (
        <TasksContext.Provider value={{dueDateAdded,setDueDateAdded,myDayState,setMyDayState, myDay,setMyDay,showCompletedDropdown,setShowCompletedDropdown,dueDate, setDueDate, selectedDueDate, setSelectedDueDate, currentTaskName, setCurrentTaskName, allTasks, setAllTasks, setStarredTasks, starredTasks, star, setStar, tasks, setTasks, completedTasks, setCompletedTasks, starId, setStarId, selectedItem, setSelectedItem }}>
            {children}
        </TasksContext.Provider>
    )
}

export default TasksContextProvider;
export const useTasks = () => useContext(TasksContext)