<template>
  <v-app>
    <v-main>
      <GithubCorner
        url="https://github.com/asir6/desyn-unofficial-faucet"
      ></GithubCorner>
      <v-container class="d-flex flex-column">
        <span class="align-self-center text-h3 my-10"
          >DeSyn Un-Official Faucet</span
        >
        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">
              Connect Wallet
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2">
              Faucet Drop
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3"> Done </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-container class="d-flex justify-center">
                <v-btn color="primary" @click="connectWallet">
                  Connect Wallet
                </v-btn>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-container class="d-flex justify-center">
                <v-btn color="primary" @click="drop" :loading="isBusy">
                  Faucet Drop
                </v-btn>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-container class="d-flex justify-center">
                <v-btn color="primary" @click="redirect">
                  Start Testing Desyn</v-btn
                >
              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper></v-container
      >
      <v-snackbar v-model="showError">
        {{ errorMsg }}

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="showError = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { ethers } from "ethers";
import GithubCorner from "vue-github-corners";
const abi = require("./contract/abi.json");

export default {
  name: "App",

  components: {
    GithubCorner,
  },

  data: () => ({
    provider: null,
    walletAddress: "",
    networkId: 0,
    step: 1,

    showError: false,
    errorMsg: "",
    isBusy: false,
  }),
  mounted() {},

  methods: {
    async connectWallet() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);

        if (accounts.length > 0) {
          this.walletAddress = accounts[0];
          this.step = 2;
        } else {
          this.errorMsg = "Failed to connect to wallet";
          this.showError = true;
        }
      } catch {
        this.errorMsg = "Failed to connect to wallet";
        this.showError = true;
      }
    },
    async drop() {
      this.isBusy = true;
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        if (network.chainId != 42) {
          this.errorMsg = "Please switch to kovan network.";
          this.showError = true;
          return;
        }

        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0x89621b696459370459404B1eafB6c415c84EdBC2",
          abi,
          signer
        );

        let tx = await contract.withdraw();
        await tx.wait();
        this.step = 3;
      } catch (err) {
        this.errorMsg =
          "Failed to get tokens from faucet, have you already asked for tokens before?";
        this.showError = true;
        console.log(err);
      } finally {
        this.isBusy = false;
      }
    },
    async redirect() {
      this.step = 1;
      window.location.href = "https://test.desyn.io/";
    },
  },
};
</script>
