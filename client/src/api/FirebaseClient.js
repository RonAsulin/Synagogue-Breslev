
import app from "./firebaseConfig";
import {getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import {addDoc, collection, deleteDoc, doc, getDocs, getFirestore, limit, orderBy, query, updateDoc} from 'firebase/firestore'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

class FirebaseClient {

    static #instance = null;
    #db = getFirestore(app);
    #storage = getStorage(app);
    #auth = getAuth(app);
    static getInstance() {
        if(this.#instance == null)
            this.#instance = new FirebaseClient();
        return this.#instance;
    }
   static GetStorage() {
    if (this.getInstance().#storage == null)
      this.getInstance().#storage = getStorage(app);
    return this.getInstance().#storage;
  }
    


    async login(email,password) 
    {
        try {
            const user = await signInWithEmailAndPassword(this.#auth,email,password);
            localStorage.setItem("uid", user.uid);
            return user.user.uid;

        } catch (error) {
            
            return error;
        }
    }
    async logout(){
        try {
            await signOut(this.#auth);
            localStorage.removeItem("uid");
        } catch (error) {
            
        }
    }
    async GetPrayingTimes()
    {
        try {
            const prayingCollection = collection(this.#db, "praying_times");
            const q = query(prayingCollection, orderBy("created_at", "asc"));
            const allEntries = await getDocs(q);

            return allEntries.docs.map((entry) => ({...entry.data(), _id: entry.id}));
        } catch (error) {
            
            return error;
        }
    }
    async AppendPrayingTime(data)
    {
        

        try {
            const prayingCollection = collection(this.#db,"praying_times");
            const newData = await addDoc(prayingCollection, data);
            return newData;
        } catch (error) {
            
            return error;
        }
    }
    async UpdatePrayingTime(data)
    {
        try {
            const docReference = doc(this.#db, `praying_times/${data._id}`)
            await updateDoc(docReference,data);
            return data;
        } catch (error) {
            
            return error;
        }
    }
  async DeletePrayingTime(id) {
    try {
      const docReference = doc(this.#db, `praying_times/${id}`);
      await deleteDoc(docReference);
      return id;
    } catch (error) {
      return error;
    }
  }
    async UploadFile(file)
    {
        try {
            const time_stamp = Date.now();
            const name_no_mime = file.name.split('.');
            const joined_name = name_no_mime.join('_')
            const filesRef = ref(this.#storage, `papers/${joined_name}_${time_stamp}.pdf`);
            const fileRef = await uploadBytes(filesRef,file, {contentType: `application/pdf`});
            const url = await getDownloadURL(fileRef.ref);

            return {download_url: url, path: `papers/${joined_name}_${time_stamp}.pdf`};

        } catch (error) {
            return error;
        }
    }
    async AppendPaperEntry(data)
    {
        try {
            const collectionRef = collection(this.#db, `papers`);
            const newEntry = await addDoc(collectionRef, data);
            return {id: newEntry.id, ...data};
        } catch (error) {
            return error;
        }
    }
        async GetPapers()
    {
        try {
            const papersCollection = collection(this.#db, "papers");
            const q = query(papersCollection, orderBy("date", "desc"), limit(5))
            const allEntries = await getDocs(q);

            return allEntries.docs.map((entry) => ({...entry.data(), _id: entry.id}));
        } catch (error) {
            
            return error;
        }
    }
    async DeletePaper(paper)
    {
        try {

            const paperReference = ref(this.#storage,paper.file.path);
            await deleteObject(paperReference);

            const paperDocReference = doc(this.#db, `papers/${paper._id}`)
            await deleteDoc(paperDocReference);
            return paper;
        } catch (error) {
            return error;
        }
    }
    async GetMessages() {
        try {
            const messagesCollection = collection(this.#db, 'msgUpdate');
            const q = query(messagesCollection, orderBy('date', 'desc'));

            const allEntries = await getDocs(q);

            return allEntries.docs.map((entry) => ({ ...entry.data(), id: entry.id }));
        } catch (error) {
            return error;
        }
    }
    async AppendMessage(data) {
        try {
            const messagesCollection = collection(this.#db, 'msgUpdate');
            const newEntry = await addDoc(messagesCollection, data);
            return { id: newEntry.id, ...data };
        } catch (error) {
            return error;
        }
    }
    async UpdateMessage(id, data) {
  try {
            const messageDocReference = doc(this.#db, `msgUpdate/${id}`);
            await updateDoc(messageDocReference, data);
            return data;
        } catch (error) {
            return error;
        }
    }

async DeleteMessage(id) {
  try {
            const messageDocReference = doc(this.#db, `msgUpdate/${id}`);
            await deleteDoc(messageDocReference);
            return id;
        } catch (error) {
            return error;
        }
    }

    


}
export default FirebaseClient;
