
class Contact {
    constructor(name, email, phone, birthday){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.birthday = birthday;
    }
}


class UI {

    addContactToList(contact) {
        const list = document.getElementById('contact-list');

        const row = document.createElement('tr');
       
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.birthday}</td>
            <td><a class="btn btn-floating delete">x</a></td>
        `;
        list.appendChild(row);
    }

    showAlert(getMsg, getClass) {

            const div = document.createElement('div');
            div.className = `alert alert-${getClass}`;
            div.appendChild(document.createTextNode(getMsg));
            const card = document.querySelector('.card');
            const cardAction = document.querySelector('.card-action');
            card.insertBefore(div, cardAction);
            setTimeout(function(){
                document.querySelector('.alert').remove();
            },2000);
        
    }
    
    deleteContact(target) {

        target.parentElement.parentElement.remove();
        Store.removeContact(target.parentElement.parentElement.children[2].textContent);
        this.showAlert('Contact Removed!', 'danger');  

        
    }

    clearFields() {

        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('birthday').value = '';

    }

    searchName(text){
        const rows = document.querySelectorAll('#contact-list tr');
        rows.forEach(function(row){
            if(row.children[0].textContent.toUpperCase().indexOf(text) != -1){
                row.style.display = 'table-row';                
            }else{
                row.style.display = 'none';
            };
        });

    }
}


class Store {
    static getContact(){
        let contact;
        if(localStorage.getItem('contacts') === null){
            contact = [];
        }else {
            contact = JSON.parse(localStorage.getItem('contacts'));
        }
        return contact;
    }
    static displayContact(){
        const contacts = Store.getContact();
        contacts.forEach(function(contact){
            const ui =  new UI(); 
            ui.addContactToList(contact);
        });
    }
    static addContact(contact){
        
        const contacts = Store.getContact();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    
    static removeContact(phone){
        const contacts = Store.getContact();
        contacts.forEach( (contact, index) => {
            if(contact.phone === phone) {
                contacts.splice(index, 1);
            }
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}


document.addEventListener('DOMContentLoaded', Store.displayContact());

document.getElementById('contact-form').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value,
        email = document.getElementById('email').value,
        phone = document.getElementById('phone').value;
        birthday = document.getElementById('birthday').value;
        const contact = new Contact(name, email, phone, birthday);
        const ui = new UI();
     
        if(name === '' || phone === ''){
          
            document.querySelector('.progress').style.display = 'block';
            setTimeout(function(){
                document.querySelector('.progress').style.display = 'none';
                ui.showAlert('Please fill Name & Phone Fields at least', 'danger');
            },500);
        }else{
           
            document.querySelector('.progress').style.display = 'block';
            setTimeout(function(){
                document.querySelector('.progress').style.display = 'none';
                ui.addContactToList(contact);
                Store.addContact(contact);
                ui.showAlert('New Contact Added!', 'success');
                ui.clearFields();  
            },1000);
        }
});


document.getElementById('contact-list').addEventListener('click', function(e){

    const ui = new UI();

    if(e.target.classList.contains('delete')){

        if(confirm('Are you sure?')){

            document.querySelector('.progress').style.display = 'block';
            setTimeout(function(){
                document.querySelector('.progress').style.display = 'none';
                ui.deleteContact(e.target);
            },1000);
        
        }

    }
    e.preventDefault();
});

 
document.getElementById('search').addEventListener('keyup', function(e){
    const ui = new UI();
    ui.searchName(e.target.value.toUpperCase());
});

