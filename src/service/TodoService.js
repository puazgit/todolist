import app from '../firebase.config'

import { getFirestore , collection , getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore'

const dbFirestore = getFirestore(app)
const todoCollections = collection(dbFirestore, 'todos') // <--- nama collection yang dibuat di firebase

class TodoServices{
   getAllTodos(){
      return getDocs(todoCollections)
   }

   getCompletedTodos(){
      return getDocs(query(todoCollections, where('checked', '==', true)))
   }
   getImportantTodos(){
      return getDocs(query(todoCollections, where('isImportant', '==', true)))
   }
   insertTodo(todo){
      return addDoc(todoCollections, todo)
   }

   deleteTodo(id){
      return deleteDoc (doc(dbFirestore, 'todos', id))
   }
   updateTodo(todo){
      const tempId = todo.id;
      delete todo.id;
      return updateDoc(doc(dbFirestore, 'todos', tempId), todo)
   }
}

export default new TodoServices()