import { Connection, PublicKey } from '@solana/web3.js'
import { Program, Provider } from '@project-serum/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-vue'
import { computed } from 'vue'

const cluster = process.env.VUE_APP_CLUSTER
const clusterUrl = process.env.VUE_APP_CLUSTER_URL
const preflightCommitment = 'processed'
const idl = require(`@/idl/${cluster}.json`)
const programID = new PublicKey(idl.metadata.address)
let workspaceState = {};

export const useWorkspace = () => workspaceState

export const initWorkspace = () => {
    const wallet = useAnchorWallet()
    const connection = new Connection(clusterUrl, preflightCommitment)
    const provider = computed(() => new Provider(connection, wallet.value, { preflightCommitment }))
    const program = computed(() => new Program(idl, programID, provider.value))

    workspaceState = {
        connection,
        provider,
        program,
        wallet,
    }
}
