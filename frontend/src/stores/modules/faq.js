import FaqService from '../../services/faq';
import router from '../../router'

const state = {
    status: {},
    data: {},
    faqCategories:[]
}

const mutations = {
    setFaqSuccess(state, data){
        data.categorySelected = {
            code : data.category ? data.category.id : "",
            label : data.category ? data.category.name : "",
        }
        state.data = data
        state.status = {};
    },
    setFaqFailure(state){
        state.data = {};
        state.status = {};
    },
    setFaqCategoriesSuccess(state, data){
        state.faqCategories = data
        state.status = {};
    },
    setFaqCategoriesFailure(state){
        state.faqCategories = {};
        state.status = {};
    },
    submit(state) {
        state.status = { sendRequest: true };
    },
}

const actions = {
    categories({ commit }) {
        FaqService.categoriesFaq()
            .then(
                response => commit('setFaqCategoriesSuccess', response),
                error => commit('setFaqCategoriesFailure', error)
            );
    },
    detail({ commit }, id) {
        FaqService.detailFaq(id)
            .then(
                response => commit('setFaqSuccess', response.data),
                error => commit('setFaqFailure', error)
            );
    },
    delete({ dispatch, commit }, id) {
        FaqService.deleteFaq(id)
            .then(
                response => {
                    commit('setFaqSuccess', response.data);
                    setTimeout(() => {
                        dispatch('alert/success', 'Your record has been delete !!', { root: true });
                    })
                },
                error => {
                    commit('setFaqFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    create({ dispatch, commit }, data) {
        commit('submit', data);
        data.category_id = data.categorySelected.code
        FaqService.createFaq(data)
            .then(
                response => {
                    commit('setFaqSuccess', response.data);
                    setTimeout(() => {
                        dispatch('alert/success', 'Your record has been created !!', { root: true });
                    })
                    router.push('/admin/faq/detail/'+response.data.id);
                },
                error => {
                    commit('setFaqFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    update({ dispatch, commit }, data) {
        commit('submit', data.faq);
        data.faq.category_id = data.faq.categorySelected.code
        FaqService.updateFaq(data.faq, data.param)
            .then(
                response => {
                    commit('setFaqSuccess', response.data);
                    setTimeout(() => {
                        dispatch('alert/success', 'Your record has been updated !!', { root: true });
                    })
                    router.push('/admin/faq/detail/'+data.param);
                },
                error => {
                    commit('setFaqFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
}


const faq = {
    namespaced : true,
    state,
    actions,
    mutations
}

export default faq