import PDFDocument from 'pdfkit';
import { IResumeData } from '../types';

export class PDFExportService {
  /**
   * Generates a single-column, ATS-compliant PDF binary buffer
   */
  public static async generateResumePDF(resume: IResumeData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 36, bottom: 36, left: 36, right: 36 },
        bufferPages: true
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const template = resume.templateId || 'ats-classic';

      // Header: Name & Contact
      doc.fontSize(20).font('Helvetica-Bold').text(resume.personalInfo.fullName || 'Candidate Name', { align: 'center' });
      doc.moveDown(0.2);

      const contactItems = [
        resume.personalInfo.email,
        resume.personalInfo.phone,
        resume.personalInfo.location,
        resume.personalInfo.linkedin,
        resume.personalInfo.github
      ].filter(Boolean);

      doc.fontSize(9).font('Helvetica').text(contactItems.join('  |  '), { align: 'center' });
      doc.moveDown(0.8);

      // Helper for section headings
      const renderSectionHeading = (title: string) => {
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica-Bold').text(title.toUpperCase());
        doc.moveTo(36, doc.y).lineTo(559, doc.y).stroke('#333333');
        doc.moveDown(0.4);
      };

      // 1. Professional Summary
      if (resume.professionalSummary) {
        renderSectionHeading('Professional Summary');
        doc.fontSize(10).font('Helvetica').text(resume.professionalSummary, { lineGap: 2 });
      }

      // 2. Technical Skills
      const skills = resume.skills;
      if (skills) {
        renderSectionHeading('Technical Skills');
        doc.fontSize(9).font('Helvetica');
        if (skills.programmingLanguages?.length) {
          doc.font('Helvetica-Bold').text('Programming Languages: ', { continued: true })
             .font('Helvetica').text(skills.programmingLanguages.join(', '));
        }
        if (skills.frameworks?.length) {
          doc.font('Helvetica-Bold').text('Frameworks & Libraries: ', { continued: true })
             .font('Helvetica').text(skills.frameworks.concat(skills.libraries || []).join(', '));
        }
        if (skills.databases?.length) {
          doc.font('Helvetica-Bold').text('Databases: ', { continued: true })
             .font('Helvetica').text(skills.databases.join(', '));
        }
        if (skills.tools?.length || skills.cloud?.length) {
          doc.font('Helvetica-Bold').text('Tools & Cloud: ', { continued: true })
             .font('Helvetica').text((skills.tools || []).concat(skills.cloud || []).join(', '));
        }
        if (resume.softSkills?.length) {
          doc.font('Helvetica-Bold').text('Soft Skills & Competencies: ', { continued: true })
             .font('Helvetica').text(resume.softSkills.join(', '));
        }
      }

      // 3. Technical Projects
      if (resume.projects && resume.projects.length > 0) {
        renderSectionHeading('Technical Projects');
        resume.projects.forEach(project => {
          doc.fontSize(10).font('Helvetica-Bold').text(project.title, { continued: true });
          if (project.technologies?.length) {
            doc.font('Helvetica-Oblique').text(`  |  ${project.technologies.join(', ')}`);
          } else {
            doc.text('');
          }
          if (project.description) {
            doc.fontSize(9).font('Helvetica').text(project.description, { lineGap: 1 });
          }
          project.responsibilities?.forEach(bullet => {
            doc.fontSize(9).font('Helvetica').text(`•  ${bullet}`, { indent: 10, lineGap: 1 });
          });
          doc.moveDown(0.3);
        });
      }

      // 4. Experience / Internships
      if (resume.experience && resume.experience.length > 0) {
        renderSectionHeading('Work Experience & Internships');
        resume.experience.forEach(exp => {
          doc.fontSize(10).font('Helvetica-Bold').text(exp.role, { continued: true });
          doc.font('Helvetica').text(`  —  ${exp.company}`, { continued: true });
          doc.font('Helvetica-Oblique').text(`  (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})`, { align: 'right' });
          exp.responsibilities?.forEach(bullet => {
            doc.fontSize(9).font('Helvetica').text(`•  ${bullet}`, { indent: 10, lineGap: 1 });
          });
          doc.moveDown(0.3);
        });
      }

      // 5. Education
      if (resume.education && resume.education.length > 0) {
        renderSectionHeading('Education');
        resume.education.forEach(edu => {
          doc.fontSize(10).font('Helvetica-Bold').text(edu.degree, { continued: true });
          doc.font('Helvetica').text(`  —  ${edu.institution}`, { continued: true });
          doc.font('Helvetica-Oblique').text(`  (${edu.endYear})`, { align: 'right' });
          if (edu.cgpaOrPercentage) {
            doc.fontSize(9).font('Helvetica').text(`CGPA/Score: ${edu.cgpaOrPercentage}`, { indent: 10 });
          }
          doc.moveDown(0.2);
        });
      }

      // 6. Certifications & Achievements
      if (resume.certifications?.length || resume.achievements?.length) {
        renderSectionHeading('Certifications & Achievements');
        resume.certifications?.forEach(cert => {
          doc.fontSize(9).font('Helvetica').text(`•  ${cert.name} — ${cert.issuer}`, { indent: 10 });
        });
        resume.achievements?.forEach(ach => {
          doc.fontSize(9).font('Helvetica').text(`•  ${ach.title}: ${ach.description}`, { indent: 10 });
        });
      }

      doc.end();
    });
  }
}
