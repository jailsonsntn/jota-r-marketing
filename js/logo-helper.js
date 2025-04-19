// Logo da empresa
const logoPlaceholder = `
<img src="img/logos/LogoVerde.png" alt="Jota R Marketing" class="img-fluid" style="max-width: 150px;">
`;

// Atualizar a referência do logo no HTML
document.addEventListener('DOMContentLoaded', function() {
    // Substituir a imagem do logo no relatório
    const reportContent = document.getElementById('reportContent');
    if (reportContent) {
        const reportHTML = reportContent.innerHTML;
        const updatedHTML = reportHTML.replace(
            '<img src="img/logo-placeholder.png" alt="Jota R Marketing" class="img-fluid" style="max-width: 150px;">',
            logoPlaceholder
        );
        reportContent.innerHTML = updatedHTML;
    }
});
