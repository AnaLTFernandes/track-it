import { useContext, useState } from "react";
import styled from "styled-components";

import { ActionsDisabledContext, UserDataContext, AlertContext } from '../../../contexts/';
import { postHabit } from "../../../services/service";
import { Loading } from "../../Actions/";

import Button from "../../../assets/styles/Button";
import DayButton from "./DayButton";
import DaysButtonsArrays from "../CreateHabit/DaysButtonsArray";


let daysButton = DaysButtonsArrays;

export default function CreateHabit({ updateList, setUpdateList, setFormActive }) {

    const { actionDisabled, setActionDisabled } = useContext(ActionsDisabledContext);
    const { setAlertMessage } = useContext(AlertContext);
    const { userData, setUserData } = useContext(UserDataContext);

    const [form, setForm] = useState({...userData.formCanceled});

    
    function updateForm({ name, value })  {

        setForm({
            ...form,
            [name]: value
        })
    }
    
    function handleForm (event) {

        event.preventDefault();

        form.days = daysButton
            .filter(({ selected }) => selected)
            .map((day) => day.index);

        setActionDisabled(true);

        if (form.days.length > 0) {
            const promise = postHabit(form);

            promise.catch((e) => {
                setAlertMessage({alert:true, message:e.response.data.message});
                
                setTimeout(() => {
                    setActionDisabled(false);
                }, 2100);
            });

            promise.then(() => {
                daysButton = daysButton.map(day => ({...day, selected: false}));
                setUserData({...userData, formCanceled: {}});
                setActionDisabled(false);
                setFormActive(false);
                setUpdateList(!updateList);
            });
        }
        else {
            setAlertMessage({alert:true, message:'Você precisa escolher pelo menos um dia!'});
                
            setTimeout(() => {
                setActionDisabled(false);
            }, 2100);
        }
    }


    function cancelHabit () {
        form.days = daysButton
            .filter(({ selected }) => selected)
            .map((day) =>  day.index);

        setUserData({...userData, formCanceled: {...form}});

        if (!actionDisabled) {
            setFormActive(false);
        }
    }
    
    
    return (
        <Form onSubmit={handleForm}>

            <input 
                required
                pattern='(([A-Za-zá-ùÁ-Ùã-õ0-9\s]){1,20})'
                type='text'
                name="name"
                placeholder="nome do hábito"
                defaultValue={form.name}
                disabled={actionDisabled}
                onChange={e => updateForm({name:e.target.name, value:e.target.value})}>
            </input>

            <Days>
                {daysButton.map((day, index) => 
                    <DayButton key={index} day={day} disabled={actionDisabled} />
                )}
            </Days>

            <Buttons>
                <CancelButton 
                    disabled={actionDisabled} 
                    onClick={cancelHabit}>
                        Cancelar
                </CancelButton>
                <Button
                    width='84px'
                    height='35px'
                    margin='0'
                    fontSize='16px'>
                        {actionDisabled ? <Loading size='20px'/> : 'Salvar'}
                </Button>
            </Buttons>

        </Form>
    );
}

const Form = styled.form`
    width: 100%;
    height: 180px;
    border-radius: 5px;
    margin-bottom: 29px;
    padding: 18px;
    background-color: var(--white);

    input {
        width: 100%;
        height: 45px;
        padding: 0 11px;
        background-color: var(--white);
        border-radius: 5px;
        border: 1px solid #D4D4D4;
        font-size: 20px;
        color: #666666;
    }

    input::placeholder {
        color: #DBDBDB;
    }

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px white inset;
    }
  
    input:-webkit-autofill {
      -webkit-text-fill-color: black;
    }

    input:disabled {
        background-color: #F2F2F2;
        -webkit-box-shadow: 0 0 0 30px #F2F2F2 inset;
        border: 1px solid #D4D4D4;
        color: #AFAFAF;
        -webkit-text-fill-color: #AFAFAF;
    }

    button:disabled {
        opacity: 0.7;
    }
`;

const Buttons = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const CancelButton = styled.div`
    width: 120px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: none;
    background-color: var(--white);
    color: var(--light-blue-theme);
    opacity: ${props => props.disabled ? '0.7' : '1' };
    cursor: pointer;
`;

const Days = styled.div`
    display: flex;
    justify-content: flex-start;
`;