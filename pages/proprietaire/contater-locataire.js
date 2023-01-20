
import AhFooter from "../../components/navigation/AhFooter";
import Head from "next/head";
import TextField from '@mui/material/TextField';
import * as React from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import NavBarProprio from "../../components/navigation/NavBarProprio";
import styles from "../../styles/components/FormContacterLocataire.module.css";


export default function ContacterLocataire(props) {


  const schema = yup.object({
    title: yup.string().required("Objet obligatoire"),
    summary: yup.string().max(1000,"1000 caractère maximun").required("Message obligatoire"),
    owner: yup.string().required("Nom obligatoire"),
  }).required();

  const {register, formState: { errors }, handleSubmit} = useForm({
    resolver: yupResolver(schema)
  });

  async function onSubmit(data) {
    // send form data
    /*nextClient
      .post(postURL, data)
      .then(() => setDisplaySuccess(true))
      .catch(() => setDisplaySuccess(false));*/
      console.log(data);
    return false;
  }


  return (

    <>

<Head>
        <title>AtypikHouse</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossOrigin="anonymous"
        />
      </Head>

<div className="wrap d-flex flex-column">
 <NavBarProprio/>
 
 <card className={styles.contacterLoc}>
 <div style={{
        fontWeight:'bold',
        fontSize:'1.2em',
        marginLeft:'5%'}}>Contacter un locataire</div>

  <form onSubmit={handleSubmit(onSubmit)} className={styles.contacterLocForm}>

          <div>
              <TextField fullWidth variant="outlined" label="Objet du message" name="title" {...register("title")}/>
              <span style={{color:"red"}}>{errors.title?.message}</span> 
          </div>
          <div>
              <TextField fullWidth variant="outlined" label="Nom propriétaire" name="owner" {...register("owner")}/>
              <span style={{color:"red"}}>{errors.owner?.message}</span> 
          </div>
          <div>
                 <TextField fullWidth variant="outlined" label="Message" multiline
                  rows={6} name="summary" {...register("summary")}/>
                 <span style={{color:"red"}}>{errors.summary?.message}</span>
          </div>
            
            
              <Button type="submit" endIcon={<SendIcon />}>
                Envoyer
              </Button>
            
   </form>

 </card>

<AhFooter></AhFooter>
</div>

    </>

  );
}