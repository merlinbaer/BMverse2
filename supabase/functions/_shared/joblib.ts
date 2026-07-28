import { SupabaseClient } from '@supabase/supabase-js'
import { connectAnonDB } from "./global.ts";

export default class Job {
    name: string;
    id: string;
    jobTable: string;
    httpMethod: string;
    cronHeader: string | null;
    cronEnv: string | undefined;
    db: SupabaseClient;
    isValid: boolean;
    testOverride: boolean;
    
    constructor( req: Request){
        this.jobTable = 'gl_jobs';
        this.name = new URL(req.url).pathname.replaceAll('/', '');
        this.id = "";
        this.httpMethod = req.method;
        this.cronHeader = req.headers.get('cron-job-id');
        this.cronEnv = Deno.env.get('API_JOB_' + this.name.toUpperCase());
        this.db = connectAnonDB(); 
        this.testOverride = false;
        this.isValid = this.validate();
    }

    log(message: string){
        console.log("Job-" + this.name + ": " + message)
    }

    validate(){
        if (!this.cronHeader || this.cronHeader !== this.cronEnv || !this.db ){
            if (Deno.env.get('JOB_ENV') === "local") {
                this.testOverride = true;
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }

    async insertJob(newJob: { name: string; status: string; message: string}) {
        const {data , error } = await this.db
            .from(this.jobTable)
            .insert([newJob])
            .select('id')
        if (error){
            throw error
        }
        return data[0].id;
    }

    async updateJob(status: string, message: string) {
        const { error } = await this.db
            .from(this.jobTable)
            .update({ status: status, message: message })
            .eq('id', this.id);
        if (error) {
            throw error;
        }
    }

    async start(){
        const message= "is starting: \n" +
            "Functionname: " + this.name + "; \n" + 
            "Http method: " + this.httpMethod + "; \n" +
            "Valid call: " + (this.testOverride ? "Test override: false -> true" : this.isValid) + ";";
        this.log(message)
        try {
            const newJob = { name: this.name, status: "STARTING", message: message };
            this.id = await this.insertJob(newJob)
        } catch(error) {
            this.log("Fatal Error: Insert into table " + this.jobTable + ": " + error)
        }
    }  

    async end(message: string = ""){
        try {
            await this.updateJob("OK", message)
            this.log("ended OK.")
        } catch(error) {
            this.log("Fatal Error: Update table "+ this.jobTable + ": " + error)
        }
    }

    async error(message: string){
        try {
            this.log("Error: " + message)
            await this.updateJob("ERROR", message)
        } catch(error) {
            this.log("Fatal Error: Update table "+ this.jobTable + ": " + error)
        }
    }
}
