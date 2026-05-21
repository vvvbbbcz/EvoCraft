<script setup lang="ts">
import { socket } from '@/socket';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { VForm } from 'vuetify/components';

const { t } = useI18n();

const adding = ref(false);

const form = ref<VForm>();
const formState = ref({
    username: '',
    auth: 'offline',
});
const formRules = {
    username: [(v: string) => !!v || t('page.bots.add.validation.username.required')],
    auth: [(v: string) => !!v || t('page.bots.add.validation.auth.required')],
};

async function submit() {
    if (!form.value) return;

    const { valid } = await form.value.validate();
    if (!valid) return;

    socket.emit('createBot', formState.value);
    form.value.reset();

    adding.value = false;
}

interface BotStatus {
    username: string;
    online: boolean;
}

const bots = ref<Map<number, Partial<BotStatus>>>(new Map());

socket.emit('listBots');

socket.on('listBots', (data: { id: number, username: string }[]) => {
    bots.value = new Map(data.map(bot => [bot.id, { username: bot.username }]));
});

socket.on('botStatus', (id: number, data: Partial<BotStatus>) => {
    bots.value.set(id, { ...bots.value.get(id), ...data });
});
</script>

<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12" v-for="[id, bot] in bots">
                    <v-card>
                        <template v-slot:title>
                            <span class="m-r-1">{{ bot.username }}</span>
                            <v-chip :color="bot.online ? 'green' : 'red'">
                                {{ bot.online ? $t('appState.socket.online') : $t('appState.socket.offline') }}
                            </v-chip>
                        </template>

                        <template v-slot:subtitle>
                            {{ `ID: ${id}` }}
                        </template>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-navigation-drawer v-model="adding" location="right">
            <v-container>
                <v-form ref="form" validate-on="submit lazy" @submit.prevent="submit">
                    <v-text-field v-model="formState.username" :label="$t('page.bots.add.username')"
                        :rules="formRules.username" variant="outlined" />

                    <v-radio-group v-model="formState.auth" :label="$t('page.bots.add.auth.title')"
                        :rules="formRules.auth">
                        <v-radio :label="$t('page.bots.add.auth.offline')" value="offline" />
                    </v-radio-group>

                    <v-btn block color="primary" type="submit">
                        {{ $t('page.bots.add.submit') }}
                    </v-btn>
                </v-form>
            </v-container>
        </v-navigation-drawer>

        <v-fab :icon="adding ? 'mdi-close' : 'mdi-plus'" color="primary" location="right bottom" size="large" app
            @click="adding = !adding" />
    </div>
</template>

<style></style>
