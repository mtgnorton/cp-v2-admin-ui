const system = {
  state: {
    cpuInfo: null,
    memoryInfo: null,
    administratorCount: null,
    blockInfo: {}
  },

  mutations: {
    'setCpu': (state, cpuInfo) => {
      state.cpuInfo = cpuInfo
    },
    'setMemory': (state, memoryInfo) => {
      state.memoryInfo = memoryInfo
    },

    'setAdministratorCount': (state, administratorCount) => {
      state.administratorCount = administratorCount
    },
    'setBlockInfo': (state, blockInfo) => {
      state.blockInfo = blockInfo
    }
  }
}
export default system
