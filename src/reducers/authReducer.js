// import actions later

const initialState = {}

const branchTable = {
    // [action]: (state, action) => {return {...state}}
}
export default (state = initialState, action) => {
    //return action.type in branchTable ? branchTable[action.type](state, action) : state;
    return state;
}
