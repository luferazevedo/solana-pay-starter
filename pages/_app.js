import React, { useMemo } from "react";
import "../styles/globals.css";
import "../styles/App.css";
// BIBLIOTECAS DAS WALLETS 

//https://github.com/solana-labs/wallet-adapter/tree/master/packages/core/base
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"; // Apenas um objeto enumerável para as redes disponíveis

//https://github.com/solana-labs/wallet-adapter/#wallets
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"; // Componente sofisticado do React que solicitará ao usuário que selecione sua carteira 

/* ConnectionProvider recebe um ponto de extremidade RPC e nos permite falar diretamente 
com os nós na blockchain Solana. Usaremos isso sempre em nosso aplicativo para enviar transações.
WalletProvider nos dá uma interface padrão para conectar a todos os tipos de carteiras*/
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"; // Os mais importantes

import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets"; // Importações para criar lista de carteiras que daremos ao WalletProvider

import { clusterApiUrl } from "@solana/web3.js"; // Apenas uma função que gera um ponto de extremidade RPC para nós com base na rede que fornecemos

import "@solana/wallet-adapter-react-ui/styles.css";

const App = ({ Component, pageProps }) => {

  // Pode ser definido como 'devnet', 'testnet' ou 'mainnet-beta'
  const network = WalletAdapterNetwork.Mainnet;

  // Você também pode fornecer um ponto de extremidade RPC personalizado
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets inclui todos os adaptadores, mas dá suporte a tree
  // shaking e lazy loading – Apenas as carteiras que você configurar aqui serão compiladas 
  // em seu aplicativo, e somente as dependências de carteiras às quais seus usuários se 
  // conectarem serão carregadas
   const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );
  /*envolvendo os filhos (o restante do aplicativo) com alguns provedores de contexto
  https://reactjs.org/docs/context.html#contextprovider*/
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
