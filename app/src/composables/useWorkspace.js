import { Connection, PublicKey } from '@solana/web3.js'
import { Program, Provider } from '@project-serum/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-vue'
import { computed } from 'vue'
import idl from '../../../target/idl/solana_twitter.json'

const programID = new PublicKey(idl.metadata.address)
let workspaceState = {};

export const useWorkspace = () => workspaceState

export const initWorkspace = (network = 'http://127.0.0.1:8899', preflightCommitment = 'processed') => {
    const wallet = useAnchorWallet()
    const connection = new Connection(network, preflightCommitment)
    const provider = computed(() => new Provider(connection, wallet.value, { preflightCommitment }))
    const program = computed(() => new Program(idl, programID, provider.value))

    workspaceState = {
        connection,
        provider,
        program,
        wallet,
    }
}
