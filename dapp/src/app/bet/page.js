"use client"

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDispute, bet, claimPrize } from "@/service/Web3Service";
import Web3 from "web3";

export default function Bet() {

    const { push } = useRouter();

    const [message, setMessage] = useState();

    const [dispute, setDispute] = useState({
        candidate1: "Loading...",
        candidate2: "Loading...",
        image1: "Loading...",
        image2: "Loading...",
        total1: 0,
        total2: 0,
        winner: 0
    });

    useEffect(() => {
        if (!localStorage.getItem("wallet")) return push('/');
        setMessage("Obtendo dados da disputa...");
        getDispute()
            .then(dispute => {
                setDispute(dispute);
                setMessage("");
            })
            .catch(err => {
                console.log(err);
                setMessage(err.message);
            });
    }, []);

    function processBet(candidate) {
        setMessage("Conectando na carteira...");
        const amountIEth = prompt("Insira a quantidade de POL que deseja apostar:", "1");
        bet(candidate, amountIEth)
            .then(tx => {
                alert("Aposta enviada com sucesso! Pode demorar 1 minuto para que apareça no sistema");
                setMessage("");
            })
            .catch(err => {
                console.log(err);
                setMessage(err.message);
            });
    }

    function btnClaimClick() {
        setMessage("Conectando na carteira...");
        claimPrize()
            .then(tx => {
                alert("Premio coletado com sucesso! Pode demorar 1 minuto para que apareça no sistema");
                setMessage("");
            })
            .catch(err => {
                console.log(err);
                setMessage(err.message);
            });
    }

    return (
        <>
            <Head>
                <title>Bet Candidate | Apostar</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="container px-4 py-5">
                <div className="row align-items-center">
                    <h1 className="display-5 fw-bold lh-1 mb-3 text-body-emphasis">Bet Candidate</h1>
                    <p className="lead">Apostas on-chain nas eleições americanas</p>
                    {
                        dispute.winner == 0
                            ? <p className="lead">Você tem até o dia da eleição para deixar sua aposta</p>
                            : <p className="lead">Disputa encerrada</p>
                    }
                </div>
                <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                    {
                        dispute.winner == 0 || dispute.winner == 1
                            ? <div className="col">
                                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>{dispute.candidate1}</h3>
                                <img src={dispute.image1} className="d-block mx-auto img-fluid rounded" width={250} />
                                {
                                    dispute.winner == 1
                                        ? <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}
                                            onClick={() => btnClaimClick()}> Pegar meu premio</button>
                                        : <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}
                                            onClick={() => processBet(1)}> Aposto neste candidado</button>
                                }

                                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>
                                    {Web3.utils.fromWei(dispute.total1, "ether")} POL</span>
                            </div>
                            : <></>
                    }
                    {
                        dispute.winner == 0 || dispute.winner == 2
                            ? <div className="col">
                                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>{dispute.candidate2}</h3>
                                <img src={dispute.image2} className="d-block mx-auto img-fluid rounded" width={250} />
                                {
                                    dispute.winner == 2
                                    ? <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}
                                        onClick={() => btnClaimClick()}> Pegar meu premio</button>
                                    : <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}
                                        onClick={() => processBet(2)}> Aposto neste candidado</button>
                                }
                                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>
                                    {Web3.utils.fromWei(dispute.total2, "ether")} POL</span>
                            </div>
                            : <></>
                    }

                    <div className="row align-items-center">
                        <p className="message">{message}</p>
                    </div>
                </div>
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <p className="col-4 mb-0 text-body-secondary">
                        &copy; 2024 BetCandidate
                    </p>
                </footer>
            </div>
        </>

    );
}
