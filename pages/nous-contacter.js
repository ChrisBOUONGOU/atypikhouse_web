import { Container } from "react-bootstrap";
import CustomerLayout from "../components/layout/CustomerLayout";
import TextField from '@mui/material/TextField';
import * as React from 'react';
import styles from "../styles/components/FormNousContacter.module.css";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import Card from '@mui/material/Card';


export default function NousContacter(props) {

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const schema = yup.object({
    champMotif: yup.string().required("Motif obligatoire"),
    champNom: yup.string().required("Nom obligatoire"),
    champPrenom: yup.string().required("Prénom obligatoire"),
    champMessage: yup.string().max(1000,"1000 caractère maximun").required("Message obligatoire"),
    champMail: yup.string().email("Email invalide").required("Mail obligatoire"),
    champTel: yup.string().matches(
      phoneRegExp,
      "Numéro du téléphone invalide"
    ),
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
    <CustomerLayout>
      <Card className={styles.nousContacter}>
      <div style={{
        fontWeight:'bold',
        fontSize:'1.2em',
        marginLeft:'5%'}}>Formulaire de contact</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.champForm}>
          <label id='motif'>Objet du message*</label>
          <div>
          <TextField fullWidth label="modif" 
          variant="outlined" name="champMotif" {...register("champMotif")}/>
          <span style={{color:"red"}}>{errors.champMotif?.message}</span>
          </div>
        </div>
        <div className={styles.champForm}>
          <label id='nom'>Nom*</label>
          <div>
          <TextField fullWidth label="nom"
          variant="outlined" name="champNom" {...register("champNom")}/>
          <span style={{color:"red"}}>{errors.champNom?.message}</span>
          </div>
        </div>
        <div className={styles.champForm}>
          <label id='prenom'>Prénom*</label>
          <div>
          <TextField fullWidth label="prenom" 
          variant="outlined" name="champPrenom" {...register("champPrenom")}/>
          <span style={{color:"red"}}>{errors.champPrenom?.message}</span>
          </div>
        </div>
        <div className={styles.champForm}>
          <label id='mail'>Email*</label>
          <div>
          <TextField fullWidth label="mail"
          variant="outlined" name="champMail" {...register("champMail")}/>
           <span style={{color:"red"}}>{errors.champMail?.message}</span>
          </div>
        </div>
        <div className={styles.champForm}>
          <label id='tel'>Télephone*</label>
          <div>
          <TextField fullWidth label="tel" 
          variant="outlined" name="champTel" {...register("champTel")}/>
          <span style={{color:"red"}}>{errors.champTel?.message}</span>
          </div>
        </div>
        <div className={styles.champForm}>
          <label id='message'>Méssage*</label>
          <div>
          <TextField fullWidth label="message" 
          variant="outlined" 
          multiline
          rows={6} name="champMessage" {...register("champMessage")}/>
          <span style={{color:"red"}}>{errors.champMessage?.message}</span>
          </div>
        </div>
        <div className={styles.champForm}>
        <label></label>
          <div>
            <div>*Champs obligatoires</div>
          <Button style={{width:'100%',margin:'4px'}} variant="contained" endIcon={<SendIcon />} type="submit">Envoyer</Button>
            <div>Message bien envoyé</div>
          </div>
        </div>
      </form>
      </Card>
    </CustomerLayout>
  );

}