<template>
<div class="container">
   <!-- <form>
  <div class="form-group">
    <label for="exampleInputEmail1"><h1>Simple Todo</h1></label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Important</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
   <br> -->
   <h1>Simple Todo</h1>
   <br>
   <div class="row align-items-start">
   <input type="text" v-model="newTodo.title" class="form-control">
   <button class="btn btn-info" @click="addTodoItem" v-if="!isEditMode">Tambah</button>
   <button class="btn btn-info" @click="updateTodoItem" v-else>Update</button>
   <br>
   <div class="col">
      <input type="checkbox" v-model="newTodo.isImportant"><label>&nbsp;Penting</label>
   <br>
   <p v-show="newTodo.alertKosong" class="text-danger">Task tidak boleh kosong</p>
   <hr>
   <p></p>
   <ListTodo v-for="(item, i) in todos" 
   :key="i" 
   :todo="item" 
   v-on:hapus="hapus_item(item, i)"
   @edit="editTodo(item, i)">
   </ListTodo>
        <Loading 
        :active.sync="isLoading"
        :loader="'dots'" 
        :can-cancel="false" 
        :is-full-page="true"
        />
   </div>
   </div>

</div>

</template>
<script>
import ListTodo from './ListTodo.vue'
import TodoService from '../service/TodoService';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
   name : 'SimpleTodo',
   components: {
      ListTodo,
      Loading
   },
   data (){
      return {
      newTodo : {
         title :'',
         isImportant : false,
         checked : false
      },
         alertKosong :false,
      todos : [],
      isLoading : false,
      isEditMode : false,
      editIndex : -1
      }
   },


   async mounted(){
      try{
         const todoDocs = await TodoService.getAllTodos()
         todoDocs.forEach((todo)=>{
            const item =todo.data()
            item.id = todo.id
            this.todos.push(item)
         });

      }catch (e){
         console.log("error");
         console.log(e);
      }
   },
   methods: {
      editTodo : function(item, index){
         // this.newTodo = {
         //       title : item.title,
         //       checked : item.checked,
         //       isImportant : item.isImportant
         //    }
         let stringItem = JSON.stringify(item)
         this.newTodo = JSON.parse(stringItem)
         this.isEditMode =true
         this.editIndex = index
      },
      updateTodoItem : async function(){
         if(this.newTodo.title ==""){
            this.alertKosong = true;
            return
         }
         this.isLoading = true
         try{
            await TodoService.updateTodo(this.newTodo);
            this.todos[this.editIndex] = this.newTodo;
            this.isLoading = false
         }catch (e){
            this.isLoading = false
            console.log(e);
         }

         //reset input
         this.editIndex = -1
         this.isEditMode = false
         this.newTodo = {
            title : '',
            isImportant : false,
            checked : false
         }
      },

      addTodoItem : async function(){
         if(this.newTodo.title ==""){
            this.alertKosong = true;
            return
         }
         const todo = this.newTodo;
         todo.created_at = Date.now();
         
         this.isLoading = true;
         try{
            const docTodo = await TodoService.insertTodo(todo);
            if(docTodo){
               todo.id = docTodo.id;
               this.todos.push(todo)
            }
            this.isLoading = false;

         }catch(error){
            this.isLoading = false;
            console.log(error);
         }

         //reset input
         this.alertKosong = false
         this.newTodo ={
            title : '',
            isImportant : false,
            checked : false
         };
      },

      hapus_item(item, index){
         const answer = confirm("Yakin akan menghapus data ini?");
         if(!answer){
            return;
         }
         this.isLoading = true;
         
         TodoService.deleteTodo(item.id)
         .then(()=>{
            this.todos.splice(index, 1);
         this.isLoading = false;

         }).catch(e =>{
         this.isLoading = false;

            console.log("error when deleting item");
            console.log(e);
         }
         )
      }
    }
}
</script>