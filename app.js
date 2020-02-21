const request =  require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const util = require('util')

let avaliableClasses = []

const createCombinations = classes => { 

}

const hoursTratament = hours => {   
  let withoutSpaces = hours.split('-').map( hour => hour.trim())
  let formated = []

  withoutSpaces.forEach( hour => { 
    if( hour.length > 5) { 
      let firstHour = hour.slice(0,5)
      let secondHour = hour.slice(5,10)

      if(firstHour != secondHour) { 
        formated.push(firstHour, secondHour)
      }
    } else { 
      formated.push(hour)
    }
  })
  
  return formated.map( e => e)
}

const classTreatament = grade => { 
  let splited = grade.match(/[a-z]+|[^a-z]+/gi)
  let array = splited.map(el => el)
  let data = []

  array.forEach( (grade, index, array) => { 
     
    let day;
    let hours;

    if(grade.match(/^[a-zA-Z]+$/)) { 
      day = grade 
      hours = array[index+1]

      data.push({
        day,
        hour: hoursTratament(hours)
      })
    }
  })
  
  return data 
}  

request('https://institucional.ufpel.edu.br/cursos/cod/3900', function(err, res, body) { 
  if(err) console.log(err)
  let $ = cheerio.load(body)

  $('#turmas tr').each(function() { 
    
    let title =  $(this).find('td a').text().trim()
    let turmas =  $(this).find('td td').text().trim()
    let spliting = title.split('-')
    let id = spliting[0]
    let classe
    
    if(spliting.length > 1) { 
      let fullTxt = ''
      spliting.forEach( txt => {
        if( txt.match(/[a-zA-Z]/)) {
          fullTxt += ' ' + txt 
        }
      })
      classe = fullTxt
    } else { 
      classe = spliting[1]
    }

    if(title && turmas) { 
      avaliableClasses.push({
        id: id.trim(),
        title: classe.replace('Horários', '').trim(),
        hours: classTreatament(turmas)
      })
    }

    
    // let cmb =  createCombinations(avaliableClasses)

    // console.log(util.inspect(cmb, false, null, true ))

    console.log(util.inspect(avaliableClasses, false, null, true ))

    // fs.appendFile('classes.txt', JSON.stringify(avaliableClasses), () => { 

    // })
  })

})
