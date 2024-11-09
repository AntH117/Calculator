import './Calculator.css';
import React from 'react';

export default function Calculator() {
    const [calculationList, setCalculationList] = React.useState([''])
    const [calculation, setCalculation] = React.useState('')
    const [lastInput, setLastInput] = React.useState('')
    const [ans, setAns] = React.useState('')
    const [movementMarket, setMovementMarket] = React.useState(0)
    const [previousHeight, setPreviousHeight] = React.useState(40)
    const buttons = [ [7, 8, 9, 'DEL', 'AC'], [4, 5, 6, '*', '/'], [1, 2, 3, '+', '-'], [0, '.', ' ', 'ANS', '=']]
    const complexButtons = [['(', ')', 'sin', 'cos', 'tan'], ['√', '^2', '^3', '^x', 'log',], ['Ln', '|x|', 'x!', 'e^x', 'π',], ['', '', '', '', '',]]
    const movement = ['left', 'right']

    const [calculationListMovement, setCalculationListMovement] = React.useState(['', ...calculationList, ''])

    function handleButtons(input) {
        const simpleButtons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const calculations = ['+', '*', '/', '-']
        const specialButtons = ['DEL', 'AC', 'ANS', '=', '.']
        var array = [...calculationList]
        if (simpleButtons.includes(input)) {
            if (Array.isArray(array[movementMarket])) {
                array[movementMarket][1] += input
            } else {
                array.splice(movementMarket, 0, input)
                setMovementMarket(preVal => preVal + 1)
            }
            setCalculationList(array)
        } else if (calculations.includes(input)) {
            array.splice(movementMarket, 0, input)
            setCalculationList(array)
            setMovementMarket(preVal => preVal + 1)
        } else if (specialButtons.includes(input)) {
            if (input == 'DEL' && movementMarket !== 0) {
                if (Array.isArray(array[movementMarket - 1])) {
                    if (array[movementMarket - 1][1] == '') {
                        array.splice(movementMarket - 1, 1)
                        setMovementMarket(preVal => preVal - 1)
                    } else {
                        array[movementMarket - 1][1] = array[movementMarket - 1][1].slice(0, array[movementMarket - 1][1].length - 1)
                        
                    }
                }
                else {
                    array.splice(movementMarket - 1, 1)
                    setMovementMarket(preVal => preVal - 1)
                }
                setCalculationList(array)

            } else if (input == 'AC') {
                setCalculationList([])
                setMovementMarket(0)
            } else if (input == '=' && !calculations.includes(lastInput)) {
                handleCalculation()
            } else if (input == 'ANS') {
                if (Array.isArray(array[movementMarket]) && array[movementMarket][1] == '') {
                    array[movementMarket][1] = input
                } else {
                    array.splice(movementMarket, 0, ans)
                }
                setCalculationList(array)
                setMovementMarket(preVal => preVal + ans.length - 1)
            }
        }
    }

    function handleComplexButtons(input) {
        const trig = ['sin', 'cos', 'tan', 'log', 'Ln']
        const indices = ['^2', '^3', '^x', '√', 'e^x']
        const brackets = ['(', ')']
        var array = [...calculationList]
        if (trig.includes(input)) {
            array.splice(movementMarket, 0, `${input}`, '(', ')')
            setMovementMarket(calculationList.length + 2)
            setCalculationList(array)
        } else if (indices.includes(input)) {
            if (input == '^x') {
                array.splice(movementMarket, 0, ['power', ''])
                setCalculationList(array)
            } else if (input == '√') {
                array.splice(movementMarket, 0, `√`, '(', ')')
                setMovementMarket(calculationList.length + 3)
                setCalculationList(array)
            } else if (input == 'e^x') {
                array.splice(movementMarket, 0, `e`, ['power', ''])
                setMovementMarket(calculationList.length + 1)
                setCalculationList(array)
            } 
            else {
                array.splice(movementMarket, 0,  ['power', input[1]])
                setMovementMarket(calculationList.length + 1)
                setCalculationList(array)
            }
        } else if (brackets.includes(input)) {
            array.splice(movementMarket, 0, input)
            setCalculationList(array)
            setMovementMarket(preVal => preVal + 1)
        } else if (input == '|x|') {
            array.splice(movementMarket, 0, '|', '|')
            setCalculationList(array)
            setMovementMarket(preVal => preVal + 2)
        } else if (input == 'x!') {
            array.splice(movementMarket, 0, ['factorial', ''])
            setCalculationList(array)
            setMovementMarket(calculationList.length )
        } 
        else {
            array.splice(movementMarket, 0, input)
            setCalculationList(array)
            setMovementMarket(calculationList.length + 1)
        }
        setCalculationListMovement([...calculationList, ''])
    }

    function factorial(n) { 
        let ans = 1; 
        
        if(n === 0)
            return 1;
        for (let i = 2; i <= n; i++) 
            ans = ans * i; 
        return ans; 
    }
    
    function Evaluate(array) {
        const newArray = [...array]
        const trig = ['sin', 'cos', 'tan']
        const log = ['log', 'Ln']
        const calculations = ['+', '*', '/', '-', '**']
        let empty = []
        function getBaseLog(x, y) {
            return Math.log(y) / Math.log(x);
          }
        for (let x = 0; x < newArray.length; x++) {
            if (Array.isArray(newArray[x])) {
                if (trig.includes(newArray[x][0]) && !calculations.includes(newArray[x - 1])) {
                    newArray[x] = parseFloat(Math[newArray[x][0]](eval(newArray[x][1]))).toFixed(5)
                    empty.push([x, '*'])
                } else if (trig.includes(newArray[x][0])) {
                    newArray[x] = parseFloat(Math[newArray[x][0]](eval(newArray[x][1]))).toFixed(5)
                } else if (newArray[x][0] == 'power'){
                    newArray[x] = [newArray[x][1]]
                } else if (newArray[x][0] ==  '√') {
                    newArray[x] = Math.sqrt(eval(newArray[x][1]))
                } else if (newArray[x][0] == 'factorial') {
                    newArray[x] = factorial(newArray[x][1])
                } else if (log.includes(newArray[x][0])) {
                    if (newArray[x][0] == 'log') {
                        newArray[x] = getBaseLog(10, eval(newArray[x][1])).toFixed(5)
                        empty.push([x, '*'])
                    } else if (newArray[x][0] == 'Ln'){
                        newArray[x] = getBaseLog(Math.E, eval(newArray[x][1])).toFixed(5)
                        empty.push([x, '*'])
                    }
                }
            } else if (newArray[x] == 'π') {
                newArray[x] = Math.PI
            } else if (newArray[x] == 'e') {
                newArray[x] = Math.E
            }
        }
        for (let y = 0; y < newArray.length - 1; y++) {
            if (Array.isArray(newArray[y + 1])) {
                empty.push([y + 1, '**'] )
            }
        }
        for (let z = empty.length - 1; z >= 0; z--) {
            newArray.splice(empty[z][0], 0, empty[z][1])
        }
        if (calculations.includes(newArray[0])) {
            newArray[0] = ''
        }
        const answer = eval(newArray.join('')).toString()
        if (Array.isArray(answer[0])) {
            return [answer]
        } else {
            return answer
        }
    }

    function grouping(arr) {
        const result = []
        let temp = [[], [], []]
        let inside = false;
        const trig = ['sin', 'cos', 'tan', 'log', '√', 'Ln']
        for (const element of arr) {
            if (trig.includes(element)) {
                inside = true;
                temp[0] = element
            } else if (element === '(') {
                inside = true;
                temp[1] = '('
            } else if (element === ')') {
                if (temp[2].length > 0) {
                    temp[1] += Evaluate(temp[2])
                }
                temp[1] += ')'
                if (temp[0].length > 0) {
                    result.push([temp[0], temp[1]])
                } else {
                    result.push(eval(temp[1]))
                }
                inside = false;
            } else if (inside && Array.isArray(element)) {
                temp[2].push(element)
            } else if (inside) {
                temp[2].push(element)
            } 
            else {
                result.push(element)
            }
        } 
        return result
    }

    function absoluteGroup(arr) {
        const result = []
        let temp = [[], []]
        let inside = false;
        for (const element of arr) {
            if (element === '|' && !inside) {
                inside = true;
                temp[0] = '|'
            } else if (element === '|' && inside) {
                result.push(Math.abs(Evaluate(temp[1])))
            } else if (inside) {
                temp[1].push(element)
            } else {
                result.push(element)
            }
        }
        return result
    }


    function handleCalculation() {
        let newArray = grouping([...calculationList])
        newArray = newArray.filter(x => {
            return x !== ''
        })
        if (newArray.includes('|')) {
            newArray = absoluteGroup(newArray)
        }
        console.log(newArray)
        const answer = Evaluate(newArray)
        setCalculationList(answer.split(""))
        setAns(answer)
        setMovementMarket(answer.split('').length)
    }

    function handleMovement(input) {
        if (input == 'left' && movementMarket > 0) {
            setMovementMarket(preVal => preVal -= 1)
        } else if (input == 'right' && movementMarket < calculationList.length) {
            setMovementMarket(preVal => preVal += 1)
        }
    }

    React.useEffect(() => {
        setLastInput(calculationList[calculationList.length - 1])
        if (calculationList.length < 1) {
            setCalculationListMovement([''])
        } else {
            setCalculationListMovement([...calculationList, ''])
        }
    }, [calculationList])

    React.useEffect(() => {
        if (Array.isArray(calculationList[movementMarket]) && calculationList[movementMarket][0] == 'power') {
            setPreviousHeight(20)
        } else {
            setPreviousHeight(40)
        }
    }, [movementMarket])

    function SimpleButton({input}) {

        return (
            <button className='simpleButton' onClick={() => handleButtons(input)}>
                {input}
            </button>
        )
    }
    
    function AdvancedButton({input}) {

        return (
            <button className='advancedButton' onClick={() => handleComplexButtons(input)}>
                {input}
            </button>
        )
    }
    function MovementButton({input}) {

        return (
            <button className='movementButton' onClick={() => handleMovement(input)}>
            {input}
        </button>
        )
    }
    let AdvancedRows = complexButtons.map((x) => {
        return (
            <div className='buttonRows'>
                {x.map((y) => {
                    return (<AdvancedButton input={y}/>)
                })}
            </div>
        )
    })

    const MovementRow = () => {
        return (
            <div className='movementRow'>
                {movement.map((x) => {
                    return <MovementButton input={x} />
                })}
            </div>
        )
    }
    

    let SimpleRows = buttons.map((x) => {
        return (
            <div className='buttonRows'>
                {x.map((y) => {
                    return (<SimpleButton input={y}/>)
                })}
            </div>
        )
    })
    const calculationDivs = calculationListMovement.map((x, key) => {
       return <>
       {movementMarket == key && <div className='movementMarkerDiv' id={'marker'}>
        <div className='movementMarker' style={{height: `${previousHeight}px`}}></div>
        </div>}
        {Array.isArray(x) && x[0] == 'power' ? <div className='indiciesDiv' id={key + 1}>{x[1]}</div> : Array.isArray(x) && x[0] == 'factorial' ? <div className='factorialDiv' id={key + 1}><span className='inputDiv'>{x[1]}</span>!</div>: <div className='calculationDiv' id={key + 1}>
            {x}
       </div>}
       </>
    })
   return <div className='calculatorBody'>
    <div className='calculatorHead'>
        <div className='calculatorDisplay'>
            <div className='equationDisplay'>
            {/* <h1>{calculation}</h1> */}
            {calculationDivs}
            </div>
        </div>
    </div>
    <div className='calculatorButtons'>
        <div className='advancedCalculations'>
            {MovementRow()}
            {AdvancedRows}
        </div>
        <div className='simpleCalculations'>
            {SimpleRows}
        </div>
    </div>
   </div> 
}