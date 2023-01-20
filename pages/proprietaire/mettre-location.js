import CustomerLayout from "../../components/layout/CustomerLayout";
import AhFooter from "../../components/navigation/AhFooter";
import Head from "next/head";
import { Container, Modal, Nav, Navbar } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import * as React from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import NavBarProprio from "../../components/navigation/NavBarProprio";
import Card from '@mui/material/Card';
import styles from "../../styles/components/FormNewLocation.module.css";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const steps = ['Etape 1', 'Etape 2', 'Valide creation'];

export default function MettreLocation(props) {


  const schema = yup.object({
    title: yup.string().required("Titre obligatoire"),
    summary: yup.string().max(1000,"1000 caractère maximun").required("Message obligatoire"),
    description: yup.string().max(1000,"1000 caractère maximun").required("Message obligatoire"),
    owner: yup.string().required("Champ obligatoire"),

    capacity: yup.number().positive().integer().required("Champ obligatoire"),
    nbBeds: yup.number().positive().integer().required("Champ obligatoire"),
    unitPrice: yup.number().positive().integer().required("Champ obligatoire"),
    offerType: yup.string().required("Champ obligatoire"),
    
    statut: yup.string().required("Champ obligatoire"),
    url: yup.string().required("Champ obligatoire"),
    city: yup.string().required("Champ obligatoire"),
    adress: yup.string().required("Champ obligatoire"),
    postalCode: yup.string().required("Champ obligatoire"),
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


  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {

    var newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
        setActiveStep(newActiveStep);

        /*if((activeStep===0) && (errors.title?.message)){
          newActiveStep = 
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
        setActiveStep(newActiveStep);
        }*/
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };



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
 <div style={{
        fontWeight:'bold',
        fontSize:'1.2em',
        marginLeft:'5%'}}>Crée une offre</div>
 <card className={styles.newLocation}>

     <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
  <form onSubmit={handleSubmit(onSubmit)} className={styles.newLocationForm}>


   {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Tout est valide
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
              <Button type="submit" >Confirmer la création</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
             {
            (activeStep+1) === 1 && 
            <div style={{
              height:'70%',
              display:'flex',
              flexDirection:'column',
              justifyContent:'space-around'
            }}>
              <TextField fullWidth variant="outlined" label="titre" name="title" {...register("title")}/>
              <span style={{color:"red"}}>{errors.title?.message}</span>
              <TextField fullWidth variant="outlined" label="propriétaire" name="owner" {...register("owner")}/>
              <span style={{color:"red"}}>{errors.owner?.message}</span>
                 <TextField fullWidth variant="outlined" label="sommaire" multiline
          rows={6} name="summary" {...register("summary")}/>
          <span style={{color:"red"}}>{errors.summary?.message}</span>
                 <TextField fullWidth variant="outlined" label="description"
                 multiline
                 rows={6} name="description" {...register("description")}/>
                 <span style={{color:"red"}}>{errors.description?.message}</span>
            </div>}

            {
            (activeStep+1) === 2 && 
            <div style={{
              height:'50%',
              display:'flex',
              flexDirection:'column',
              justifyContent:'space-around'
            }}><TextField fullWidth variant="outlined" label="Capaçité" name="capacity" {...register("capacity")}/>
            <span style={{color:"red"}}>{errors.capacity?.message}</span>
                 <TextField fullWidth variant="outlined" label="nombre de lits" name="nbBeds" {...register("nbBeds")}/>
                 <span style={{color:"red"}}>{errors.nbBeds?.message}</span>
                 <TextField fullWidth variant="outlined" label="prix unique" name="unitPrice" {...register("unitPrice")}/>
                 <span style={{color:"red"}}>{errors.unitPrice?.message}</span>
                 <TextField fullWidth variant="outlined" label="type de l'offre" name="offerType" {...register("offerType")}/>
                 <span style={{color:"red"}}>{errors.offerType?.message}</span><span></span>
            </div>}

            {
            (activeStep+1) === 3 && 
            <div style={{
              height:'50%',
              display:'flex',
              flexDirection:'column',
              justifyContent:'space-around'
            }}><TextField fullWidth variant="outlined" label="Status" name="statut" {...register("statut")}/>
            <span style={{color:"red"}}>{errors.statut?.message}</span>
                 <TextField fullWidth variant="outlined" label="Image" name="url" {...register("url")}/>
                 <span style={{color:"red"}}>{errors.url?.message}</span>
                 <TextField fullWidth variant="outlined" label="Ville" name="city" {...register("city")}/>
                 <span style={{color:"red"}}>{errors.city?.message}</span>
                 <TextField fullWidth variant="outlined" label="Adresse" name="adress" {...register("adress")}/>
                 <span style={{color:"red"}}>{errors.adress?.message}</span>
                 <TextField fullWidth variant="outlined" label="Code postal" name="postalCode" {...register("postalCode")}/>
                 <span style={{color:"red"}}>{errors.postalCode?.message}</span><span></span>
            </div>}
            
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-around' }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Précédent
              </Button>
            
              <Button onClick={handleNext} sx={{ mr: 1 }} disabled={activeStep !== 0 && activeStep !== 1 }>
                Suivant
              </Button>
              <Button type="submit" endIcon={<SendIcon />} sx={{ mr: 1 }} disabled={activeStep === 0 || activeStep === 1}>
                Envoyer
              </Button>
            </div>
          </React.Fragment>
        )}
   </form>

 </card>

<AhFooter></AhFooter>
</div>

    </>

  );
}