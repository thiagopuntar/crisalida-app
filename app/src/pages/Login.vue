<template>
  <q-page padding class="login-page flex center">
    <section class="content-login">
      <div class="text-login">
        <img class="login-img" src="~assets/iso1-logo.png" alt="Logo Iso1">
      </div>

      <q-form class="form-login" @submit="loginPost">
        <div>
          <q-input v-model="user.username" dense outlined bg-color="white" class="login-input" 
            placeholder="Usuário" required autofocus autocapitalize="none" autocorrect="off"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>
        <div>
          <q-input v-model="user.password" dense outlined bg-color="white" class="login-input" type="password" placeholder="Senha" required>
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          </q-input>
        </div>
        <div>
          <q-btn class="login-button" type="submit" :loading="loadingBtn" label="Entrar"/>
        </div>
      </q-form>
    </section>
  </q-page>
</template>

<script>

export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      loadingBtn: false
    }
  },
  methods: {
    loginPost() {
      this.loadingBtn = true;
      this.$store.dispatch('auth/login', this.user)
        .then(() => {
          this.$router.push({ name: 'home' });
        })
        .catch(e => {
          this.$q.notify({
            message: e.message,
            color: 'negative',
            position: 'top'
          })
        })
        .finally(() => {
          this.loadingBtn = false;
        })
    }
  }
}
</script>

<style>

  .content-login {
      background-size:100%;
      width: 100%;
      max-width: 300px;
      margin: auto;
      /* margin-top: 14rem; */
      padding: 20px;
      background-color: rgb(43, 151, 253);
      border-radius: 20px;

  }
  .content-login .text-login {
      text-align: center;
  }
  .content-login .login-img {
      width: 90%;
  }

  .content-login .login-form {
      margin: 20px;
  }
  .content-login .login-input, 
  .content-login .login-button {
      width: 100%;
      padding: 10px 5px;
      border: none;
      outline: none;
  }
  .content-login .login-button {
      background-color: #2c51f3;
      color: #fff;
  }
  .content-login .login-button:hover {
      background-color: #1916db;
      cursor: pointer;
  }
  .content-login .login-button:active {
      background-color: #1916db;
    
  }

  .login-page {
    width:100%;
    background-image:url(~assets/background-login.jpg);
  }

  .my-inner-card {
    padding: 10px;
  }

</style>
